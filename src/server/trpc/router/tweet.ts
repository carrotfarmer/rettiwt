import { protectedProcedure, publicProcedure, router } from "../trpc";
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

      if (input.msg.length > 100) {
        throw new Error("touch grass when");
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
      });
    }),
});
