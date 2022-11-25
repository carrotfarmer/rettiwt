import { protectedProcedure, router } from "../trpc";
import z from "zod";

export const tweetRouter = router({
  createTweet: protectedProcedure
    .input(
      z.object({
        msg: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          tweets: {
            create: {
              message: input.msg,
              likes: 0,
            },
          },
        },
        select: {
          tweets: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return tweet;
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
});
