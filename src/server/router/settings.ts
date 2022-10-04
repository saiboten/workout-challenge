import { createRouter } from "./context";
import { z } from "zod";

const input = z
  .object({
    nickName: z.string(),
  })
  .nullish();

export const createSettingsRouter = createRouter().mutation("nickname", {
  input,
  async resolve({ input, ctx }) {
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
  },
});
