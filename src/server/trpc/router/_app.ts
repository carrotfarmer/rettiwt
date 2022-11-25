import { router } from "../trpc";
import { authRouter } from "./auth";
import { tweetRouter } from "./tweet";

export const appRouter = router({
  auth: authRouter,
  tweet: tweetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
