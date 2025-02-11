import { z } from "zod";

export const ChatTitleDescritionResponse = z.object({
  title: z.string(),
})

export const OutfitRecommendationResponse = z.object({
  explanation: z.string(),
  outfitDescription: z.string(), 
  extraRecommendations: z.string(), // Extra details that we recommend to add
})