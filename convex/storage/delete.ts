import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    ctx.storage.delete(args.storageId)
      .then((res) => res)
      .catch((e) => {
        console.error(e)
        throw new ConvexError("Invalid `storageId` at `api.storage.delete.deleteImage`")
      })
  }
})