import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteChat = mutation({
  args: {
    _id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args._id)
  }
})