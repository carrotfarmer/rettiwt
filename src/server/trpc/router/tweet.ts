import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
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

      if (input.msg.length > 500) {
        throw new TRPCError({
          message: "touch grass when",
          code: "BAD_REQUEST",
        });
      }

      return await ctx.prisma.tweet.create({
        data: {
          ...newTweet,
          authorId: ctx.session.user.id,
        },
        include: {
          author: true,
          likedBy: true,
        },
      });
    }),

  // infiniteTweets: protectedProcedure
  //   .input(
  //     z.object({
  //       limit: z.number().min(1).nullish(),
  //       cursor: z.string().nullish(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const limit = input.limit ?? 10;
  //     const { cursor } = input;

  //     const tweets = await ctx.prisma.tweet.findMany({
  //       take: limit + 1,
  //       cursor: cursor ? { myCursor: cursor } : undefined,
  //       orderBy: {
  //         myCursor: "asc",
  //       },
  //     });

  //     let nextCursor: typeof cursor | undefined = undefined;
  //     if (tweets.length > limit) {
  //       const nextItem = tweets.pop();
  //       nextCursor = nextItem!.myCursor;
  //     }
  //     return {
  //       tweets,
  //       nextCursor,
  //     };
  //   }),

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
        include: {
          likedBy: true,
          author: true,
        },
      });
    }),

  dislikeTweet: protectedProcedure
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
            decrement: 1,
          },
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
        include: {
          likedBy: true,
          author: true,
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
        author: true,
      },
    });
  }),

  getTweet: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.tweet.findUnique({
        where: {
          id: input.tweetId,
        },
        include: {
          likedBy: true,
          author: true,
        },
      });
    }),

  deleteTweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.tweet.delete({
        where: {
          id: input.tweetId,
        },
      });
    }),

  getUserTweets: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.tweet.findMany({
        where: {
          authorId: input.userId,
        },
        include: {
          likedBy: true,
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
