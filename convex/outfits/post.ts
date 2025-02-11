import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { mutation } from "../_generated/server";

export const createOutfit = mutation({
  args: {
    userId: v.string(),
    chatId: v.string(),
    storageId: v.id("_storage"),
    url: v.string(),
    explanation: v.optional(v.string()),
    description: v.optional(v.string()),
    recommendations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const validChatId = await ctx.db.normalizeId("chats", args.chatId)
    if (!validChatId) throw new ConvexError("Invalid chatId");

    return await ctx.db.insert("outfits", {
      userId: args.userId,
      chatId: validChatId,
      storageId: args.storageId,
      url: args.url,
      explanation: args.explanation,
      description: args.description,
      recommendations: args.recommendations,
    })
  }
})