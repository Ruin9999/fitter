import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteClothing = mutation({
  args: {
    _id: v.id("clothes"),
  },
  handler: async (ctx, args) => {
    const clothing = await ctx.db.get(args._id);
    const storageId = clothing?.storageId;

    if(storageId) await ctx.storage.delete(storageId);

    await ctx.db.delete(args._id)
  }
})