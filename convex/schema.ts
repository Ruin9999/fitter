import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    // images: v.array(v.string()), // We don't exactly need to have a reference here since `outfits` already has a many-to-one reference.
  }).index("by_userId", ["userId"]),
  clothes: defineTable({
    storageId: v.id("_storage"),
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    url: v.string(),
  }).index("by_userId", ["userId"]),
  outfits: defineTable({
    userId: v.string(),
    chatId: v.id("chats"),
    storageId: v.id("_storage"),
    url: v.string(),
  }).index("by_chatId", ["chatId"]),
});