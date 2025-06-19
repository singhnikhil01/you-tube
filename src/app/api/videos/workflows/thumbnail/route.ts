import { db } from "@/db";
import { serve } from "@upstash/workflow/nextjs";
import { videos } from "../../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface InputType {
  videoId: string;
  userId: string;
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

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

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch transcript");
    }
    const text = await response.text();
    if (!text) {
      throw new Error("Transcript is empty");
    }
    return text;
  });

  const description = await context.run("generate-title", async () => {
    const prompt = `Your task is to summarize the transcript of a video. Please follow these guidelines:

- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.
    Transcript: 
    ${transcript}
    `;
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);

    if (!result.response || !result.response.text) {
      throw new Error("Failed to generate title");
    }
    const response = result.response;

    const output = response.text();
    return output.trim();
  });

  if (!description) {
    throw new Error("Failed to generate title");
  }

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ description: description || video.title })
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
  });
});
