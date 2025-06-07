"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Nikhil2",
  });
  return <div>pageclient says: {data.greeting}</div>;
};
