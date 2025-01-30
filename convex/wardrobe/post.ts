import OpenAI from "openai";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { action, query } from "../_generated/server";

const openai = new OpenAI()
const assistantPrompt = `
You are a detailed fashion assistant. 
Given the attached image of a single clothing item, describe it as thoroughly yet succinctly as possible. 
Include the type of garment, color, pattern, fabric, notable design features, and any apparent style or intended use. 
Avoid guessing the brand or unrelated details. 
Provide just enough information so someone could envision the clothing item clearly from your description.
`;

export const uploadImage = action({
  args: {
    name: v.string(),
    userId: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args): Promise<any> => {
    const imageUrl = await ctx.runQuery(api.wardrobe.post.getImageUrl, { storageId: args.storageId });
    if (!imageUrl) throw new Error("Failed to get image URL, please try again later.");

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: assistantPrompt },
        { role: "user",   content: [
          { type: "text", "text": "Here's an image of a piece of clothing." },
          { type: "image_url", image_url: { "url": imageUrl }}
        ]}
      ]
    })
    
    const description = openaiResponse.choices[0].message.content || "";
    
    return await ctx.runMutation(internal.wardrobe.internal.internalUploadImage, {
      userId: args.userId,
      storageId: args.storageId,
      url: imageUrl,
      name: args.name,
      description: description,
    })
  }
})

export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  }
})

