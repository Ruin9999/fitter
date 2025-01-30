import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { query } from "../_generated/server";

export const getAllChats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  }
})

export const getChatById = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const validId = await ctx.db.normalizeId("chats", args.chatId);
    if (validId) return await ctx.db.get(validId);
    else throw new ConvexError("Invalid chat Id. Please try again later.")
  }
})