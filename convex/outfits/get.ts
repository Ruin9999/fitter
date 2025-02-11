import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { query } from "../_generated/server";

export const getOutfitsByChatId = query({
  args: {
    chatId: v.string(), // We could set it to v.id("chats") but we will only cause type errors. Add checking into backend
  },
  handler: async (ctx, args) => {
    const validChatId = await ctx.db.normalizeId("chats", args.chatId);
    if (!validChatId) throw new ConvexError("Invalid `chatId` passed into `api.outfits.get.getOutfitsByChatId`");
    
    return await ctx.db
      .query("outfits")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .order("desc")
      .collect()
  }
})