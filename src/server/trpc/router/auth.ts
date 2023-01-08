import { router, publicProcedure, protectedProcedure } from "../trpc";
import z from "zod";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  // Query: Get User from user id
  getUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  setBio: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.bio.length > 100) {
        throw new Error("bio is too long");
      }

      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          bio: input.bio,
        },
      });
    }),
});
