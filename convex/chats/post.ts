import OpenAI from "openai";
import { z } from "zod";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { zodResponseFormat } from "openai/helpers/zod";
import { action, internalMutation } from "../_generated/server";

const openai = new OpenAI();
const assistantPrompt = `
You are a personal stylist, I'll provide you with:
1) A detailed list of my clothing items (descriptions).
2) A specific 'vibe' or style I want to achieve.
Using only the items from my clothing items, propose several complete outfit combinations that perfectly match the requested vibe.
For each outfit:
  - Specify which pieces you're combining.
  - Briefly explain why it sutis the vibe.
  - Highlight any key detailed (e.g. color, pattern, texture) that make the outfit special.
  - Ensure all recommentations fit the mood or style I've described and reflect a cohesive, fashionable look."
Also give me an extremely brief description of the outfit that I can use as a title and one that I can use as a description.
`

const chatResponseFormat = z.object({
  title: z.string(),
  description: z.string(),
  combination: z.array(z.string()),
})

export const createChat = action({
  args: {
    userId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all the descriptions of the clothes
    const clothes = await ctx.runQuery(api.wardrobe.get.getWardrobeByUserId, { userId: args.userId });
    const descriptions = clothes.map((clothing) => clothing.description);

    
    // Format them into a prompt along with the provided user prompt
    // Send the prompt to OpenAI and ask it to generate a outfit combination description in less than 77 tokens.
    const recommendationPrompt = `Here is my wardrobe list: [${descriptions.join("\n")}]. \n And here is the vibe that I'm going for: ${args.prompt}`;
    const openaiResponse = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: assistantPrompt },
        { role: "user", content: recommendationPrompt }
      ],
      response_format: zodResponseFormat(chatResponseFormat, "chat_response"),
    })
    
    // Get response from OpenAI
    const chatResponse = openaiResponse.choices[0].message.parsed;
    if (!chatResponse) throw new Error("Failed to generate outfit combination, please try again later.");
    
    // Send response to the lightningai model deployment
    // Get the outfit combination image
    // TODO: COMPLETE THIS PART 

    // Create a new chat with the outfit combination
    
    // Store the generated outfit combination image in the _storage.
    
  }
})

export const internalCreateChat = internalMutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      userId: args.userId,
      title: args.title,
      description: args.description,
    })
  }
})