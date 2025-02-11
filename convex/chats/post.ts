import axios from "axios"
import OpenAI from "openai"
import { ConvexError, v } from "convex/values"
import { api, internal } from "../_generated/api"
import { zodResponseFormat } from "openai/helpers/zod.mjs"
import { action, internalMutation, internalAction } from "../_generated/server"
import { ChatTitleDescritionResponse, OutfitRecommendationResponse } from "@/lib/types"

const openai = new OpenAI();
// const assistantPrompt = `
// You are a personal stylist, I'll provide you with:
// 1) A detailed list of my clothing items (descriptions).
// 2) A specific 'vibe' or style I want to achieve.
// Using only the items from my clothing items, propose several complete outfit combinations that perfectly match the requested vibe.
// For each outfit:
//   - Briefly explain why it sutis the vibe.
//   - Highlight any key details (e.g. color, pattern, texture) that I can add to improve the outfit.
//   - Ensure all recommentations fit the mood or style I've described and reflect a cohesive, fashionable look."
// Also give me an extremely brief description of the outfit. The outfit description should be in the format: "Black, slightly cropped, smooth, harley davidson logo on the front, leather jacket."
// You can add more details if you want. Always include a full outfit description from head to legs.

// If I have no items in my wardrbe, come up with a creative outfit that fits the vibe.
// `;

const assistantPrompt = `
You are a personal stylist, I'll provide you with:
1) A detailed list of my clothing items (descriptions).
2) A description of what I want to achieve for the outfit.
Using only the items from my clothing items, propose several complete outfit combinations that perfectly match the requested vibe.
For each outfit:
  - Briefly explain why it sutis the vibe.
  - Highlight any key details (e.g. color, pattern, texture) that I can add to improve the outfit.
  - Ensure all recommentations fit the mood or style I've described and reflect a cohesive, fashionable look."
Also give me an extremely brief description of the outfit.
You can add more details if you want. Always include a full outfit description from head to legs.

If I have no items in my wardrbe, come up with a creative outfit that fits the vibe.
`;

export const createChat = action({
  args: {
    userId: v.string(),
    prompt: v.string(),
    numberOfOutfits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let titleDescription = (await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      response_format: zodResponseFormat(ChatTitleDescritionResponse, "title_description_response"),
      messages: [
        { role: "system", content: "Given an input, I will generate a title and description for an outfit combination." },
        { role: "user", content: args.prompt }
      ]
    })).choices[0].message.parsed
    
    const chatId : any = await ctx.runMutation(internal.chats.post.internalCreateChat, {
      userId: args.userId,
      title: titleDescription?.title || "Failed to generate title",
      prompt: args.prompt,
    })

    await ctx.scheduler.runAfter(0, internal.chats.post.internalGenerateImageAndUpload, {
      userId: args.userId,
      chatId: chatId,
      prompt: args.prompt,
      numberOfOutfits: args.numberOfOutfits,
    })

    return chatId;
  }
});

export const internalGenerateImageAndUpload = internalAction({
  args: {
    userId: v.string(),
    chatId: v.string(),
    prompt: v.string(),
    numberOfOutfits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.numberOfOutfits) args.numberOfOutfits = 5;
    const pose = await ctx.runQuery(api.poses.get.getPoseByUserId, { userId: args.userId });
    const clothes = await ctx.runQuery(api.wardrobe.get.getWardrobeByUserId, { userId: args.userId });
    let descriptions = clothes.map((clothing) => clothing.description);
    if (descriptions.length < 1) descriptions = ["No clothes in wardrobe"];
    
    const recommendationPrompt = `Here's my wardrobe list: [${descriptions.join("\n")}]. And here is what I am going for: ${args.prompt}`;
    for (let i = 0; i < args.numberOfOutfits; i++) {
      const recommendation = (await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        response_format: zodResponseFormat(OutfitRecommendationResponse, "recommendation_response"),
        messages: [
          { role: "system", content: assistantPrompt },
          { role: "user", content: recommendationPrompt}
        ]
      })).choices[0].message.parsed

      const response = await axios.post(
        "https://8000-01jhb59vhfcxaykhbaey8jczqa.cloudspaces.litng.ai/predict",
        { "input": { "prompt": `${recommendation?.outfitDescription}`, "controlnet_image_url": `${pose?.url}` }},
        { headers: { "Content-Type": "application/json" }}
      )

      if (response.status !== 200) throw new ConvexError("Failed to generate image");
      
      const { output } = response.data; // Output only stores the base64 image.
      await ctx.runAction(api.chats.utils.uploadBase64Image, {
        userId: args.userId,
        description: recommendation?.outfitDescription || "Error generating outfit description",
        chatId: args.chatId,
        explanation: recommendation?.explanation || "Error generating explanation",
        recommendations: recommendation?.extraRecommendations || "Error generating recommendations",
        base64Image: output,
      })
    }
  }
})

export const internalCreateChat = internalMutation({
  args: {
    userId: v.string(),
    title: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      userId: args.userId,
      title: args.title,
      prompt: args.prompt,
    })
  }
})