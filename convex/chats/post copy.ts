import axios from "axios";
import OpenAI from "openai";
import { ConvexError, v } from "convex/values";
import { api, internal } from "../_generated/api";
import { componentsGeneric } from "convex/server";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { action, internalMutation, internalAction, query, mutation } from "../_generated/server";
import { ChatTitleDescritionResponse, OutfitRecommendationResponse } from "@/lib/types";

const openai = new OpenAI();
const components = componentsGeneric();

const assistantPrompt = `
You are a personal stylist, I'll provide you with:
1) A detailed list of my clothing items (descriptions).
2) A specific 'vibe' or style I want to achieve.
Using only the items from my clothing items, propose several complete outfit combinations that perfectly match the requested vibe.
For each outfit:
  - Briefly explain why it sutis the vibe.
  - Highlight any key details (e.g. color, pattern, texture) that I can add to improve the outfit.
  - Ensure all recommentations fit the mood or style I've described and reflect a cohesive, fashionable look."
Also give me an extremely brief description of the outfit. The outfit description should be in the format: "Black, slightly cropped, smooth, harley davidson logo on the front, leather jacket."
You can add more details if you want. Always include a full outfit description from head to legs.

If I have no items in my wardrbe, come up with a creative outfit that fits the vibe.
`;
// That should ressemble something like "Black, slightly cropped, smooth, harley davidson logo on the front, leather jacket.", basically the reccomended outfit should
// have a description like so. You can add more details if you want. Always include a full outfit description from head to legs.

export const createChat = action({
  args: {
    userId: v.string(),
    prompt: v.string(),
    numberOfOutfits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.numberOfOutfits) args.numberOfOutfits = 3;

    const titleDescription = (await openai.beta.chat.completions.parse({
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
    
    const clothes = await ctx.runQuery(api.wardrobe.get.getWardrobeByUserId, { userId: args.userId });
    let descriptions = clothes.map((clothing) => clothing.description);
    if (descriptions.length < 1) descriptions = ["No clothes in wardrobe"];
    
    const recommendationPrompt = `Here's my wardrobe list: [${descriptions.join("\n")}]. And here is the vibe that I'm going for: ${args.prompt}`;
    
    for(let i = 0; i < args.numberOfOutfits; i++) {
      const recommendation = (await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        response_format: zodResponseFormat(OutfitRecommendationResponse, "recommendation_response"),
        messages: [
          { role: "system", content: assistantPrompt },
          { role: "user", content: recommendationPrompt }
        ]
      })).choices[0].message.parsed

      const jobId = (await axios.post( 
        "8000-01jhb59vhfcxaykhbaey8jczqa.cloudspaces.litng.ai/predict",
        { "input": { "prompt": `${recommendation?.outfitDescription}` }},
        { headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`
        }}
      )).data.id
  
      // await ctx.scheduler.runAfter(0, internal.chats.post.internalCheckRunpodStatusAndUpload, { userId: args.userId, chatId: chatId, jobId: jobId });
      await ctx.scheduler.runAfter(0, internal.chats.post.internalCheckRunpodStatusAndUpload, {
        userId: args.userId,
        chatId: chatId,
        jobId: jobId,
        explanation: recommendation?.explanation || "Error generating explanation",
        description: recommendation?.outfitDescription || "Error generating outfit description",
        recommendations: recommendation?.extraRecommendations || "Error generating recommendations",
      });
    }

    return chatId;
  }
})

export const internalCheckRunpodStatusAndUpload = internalAction({
  args: {
    userId: v.string(),
    chatId: v.string(),
    jobId: v.string(),
    explanation: v.string(),
    description: v.string(),
    recommendations: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const pollingInterval = 1000;
    const maxRetries = 50;  
    let retries = 0;

    while (retries < maxRetries) {
      const response = await axios.get(
        `https://api.runpod.ai/v2/cy98pf6q2ggqqt/status/${args.jobId}`,
        { headers: { Authorization: `Bearer ${process.env.RUNPOD_API_KEY}` }}
      )
  
      const { status, output } = response.data
      if (status !== "COMPLETED") {
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        retries++;
        continue;
      }
      
      await ctx.runAction(api.chats.utils.uploadBase64Image, { 
        userId: args.userId, 
        chatId: args.chatId, 
        base64Image: output,
        explanation: args.explanation,
        description: args.description,
        recommendations: args.recommendations,
       });
      // await ctx.runAction(api.chats.utils.uploadBase64Image, { userId: args.userId, chatId: args.chatId, base64Image: output });
      return true
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