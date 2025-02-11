"use node";

import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const uploadBase64Image = action({
  args: { 
    userId: v.string(),
    chatId: v.string(),
    base64Image: v.string(),
    explanation: v.string(),
    description: v.string(),
    recommendations: v.string(),
   },
  handler: async (ctx, args) : Promise<any> => {
    const base64Data = args.base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([buffer], { type: "image/png" });
    const storageId = await ctx.storage.store(blob);
    const url = await ctx.runQuery(api.storage.get.getImageUrl, { storageId });

    return await ctx.runMutation(api.outfits.post.createOutfit, { 
      userId: args.userId, 
      chatId: args.chatId,
      storageId: storageId,
      url: url || "",
      explanation: args.explanation,
      description: args.description,
      recommendations: args.recommendations,
    })
  }
})