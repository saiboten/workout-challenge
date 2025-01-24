import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";

const input = z
  .object({
    nickName: z.string(),
  })
  .nullish();

export const settingsRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(input)
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.prisma?.user.update({
        where: {
          id: ctx.session?.user?.id,
        },
        data: {
          nickname: input?.nickName,
        },
      });

      return {
        success: res,
      };
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user?.id,
      },
    });

    return {
      existingNickName: user?.nickname,
    };
  }),
});
