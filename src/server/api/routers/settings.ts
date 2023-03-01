import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";

const input = z
  .object({
    nickName: z.string(),
  })
  .nullish();

export const settingsRouter = createTRPCRouter({
  updateUser: protectedProcedure.input(input).mutation(({ input, ctx }) => {
    const res = ctx.prisma?.user.update({
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
});
