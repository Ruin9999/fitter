import { v } from "convex/values"
import { internalMutation } from "../_generated/server"

export const internalUploadImage = internalMutation({
  args: {
    userId: v.string(),
    url: v.string(),
    name: v.string(),
    description: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) =>{
    return await ctx.db.insert("clothes", {
      userId: args.userId,
      storageId: args.storageId,
      url: args.url,
      name: args.name,
      description: args.description,
    })
  }
})