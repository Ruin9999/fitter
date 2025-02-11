import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export const createPose = mutation({
  args: {
    userId: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const documentUrl  = await ctx.storage.getUrl(args.storageId);
    const documentId = await ctx.db // Check for existing document
      .query("poses")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .take(1)

    if (!documentId[0]) return await ctx.db.insert("poses", { userId: args.userId, storageId: args.storageId, url: documentUrl || "" }); // Insert new document
    else {
      await ctx.storage.delete(documentId[0].storageId as Id<"_storage">); // Delete existing document
      return await ctx.db.patch(documentId[0]._id, { 
        storageId: args.storageId,
        url: documentUrl || "",
      });
    }
  }
})