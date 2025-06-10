import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import { RATELIMIT } from "@/constants";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(RATELIMIT, "10 s"),
});
