import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    prompt: v.string(),
  }).index("by_userId", ["userId"]),
  clothes: defineTable({
    userId: v.string(),
    storageId: v.string(),
    description: v.string(),
    url: v.string(),
    name: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
  outfits: defineTable({
    userId: v.string(),
    chatId: v.id("chats"),
    storageId: v.string(),
    url: v.string(),
    explanation: v.optional(v.string()),
    description: v.optional(v.string()),
    recommendations: v.optional(v.string()),
  }).index("by_chatId", ["chatId"]),
  poses: defineTable({
    userId: v.string(),
    storageId: v.string(),
    url: v.string(),
  }).index("by_userId", ["userId"]),
});