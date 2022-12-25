import { protectedProcedure, router } from "../trpc";
import z from "zod";
import type { Tweet } from "@prisma/client";

export const tweetRouter = router({
  createTweet: protectedProcedure
    .input(
      z.object({
        msg: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newTweet = {
        message: input.msg,
        likes: 0,
      } as Tweet;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tweet = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          tweets: {
            create: {
              ...newTweet,
            },
          },
        },
      });

      return newTweet;
    }),

  likeTweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.update({
        where: {
          id: input.tweetId,
        },
        data: {
          likes: {
            increment: 1,
          },
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  getTweets: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tweet.findMany({
      // return newest tweets first
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likedBy: true,
      },
    });
  }),
});
