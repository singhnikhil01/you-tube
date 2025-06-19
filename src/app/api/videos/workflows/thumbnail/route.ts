import { db } from "@/db";
import { serve } from "@upstash/workflow/nextjs";
import { videos } from "../../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenAI, Modality } from "@google/genai";
import { UTApi } from "uploadthing/server";

interface InputType {
  videoId: string;
  userId: string;
  prompt: string;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "GEMINI_API_KEY",
});

const utapi = new UTApi();

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!existingVideo) {
      throw new Error(
        "Video not found or you do not have permission to restore it"
      );
    }
    return existingVideo;
  });

  const { thumbnailUrl, thumbnailKey } = await context.run(
    "generate-thumbnail",
    async () => {
      if (!prompt || prompt.length < 10) {
        throw new Error("Prompt must be at least 10 characters long");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      if (
        !response.candidates ||
        !response.candidates[0] ||
        !response.candidates[0].content ||
        !response.candidates[0].content.parts
      ) {
        throw new Error("No valid response generated from AI model");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (imageData) {
            const buffer = Buffer.from(imageData, "base64");
            if (buffer.length > 0) {
              const utapi = new UTApi();
              const uploadResponse = await utapi.uploadFiles(
                new File([buffer], `${videoId}-thumbnail.png`, {
                  type: "image/png",
                })
              );

              if (uploadResponse.error) {
                throw new Error(
                  `Failed to upload thumbnail: ${uploadResponse.error.message}`
                );
              }

              const thumbnailUrl = uploadResponse.data.ufsUrl;
              const thumbnailKey = uploadResponse.data.key;

              if (!thumbnailUrl || !thumbnailKey) {
                throw new Error("Thumbnail upload failed, missing URL or key");
              }

              return { thumbnailUrl, thumbnailKey };
            }
          }
        }
      }

      throw new Error("No image found in generated content");
    }
  );

  await context.run("update-thumbnail", async () => {
    let oldThumbnailKey: string | undefined;

    if (video.thumbnailKey) {
      oldThumbnailKey = video.thumbnailKey;
      // const oldThumbnailUrl = video.thumbnailUrl; // Not used, so can be removed
    }

    await db
      .update(videos)
      .set({
        thumbnailUrl: thumbnailUrl,
        thumbnailKey: thumbnailKey,
      })
      .where(eq(videos.id, videoId));

    if (oldThumbnailKey) {
      await utapi.deleteFiles(oldThumbnailKey);
    }

    return { thumbnailUrl, thumbnailKey };
  });
});
