/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chats_delete from "../chats/delete.js";
import type * as chats_get from "../chats/get.js";
import type * as chats_post from "../chats/post.js";
import type * as chats_utils from "../chats/utils.js";
import type * as outfits_get from "../outfits/get.js";
import type * as outfits_post from "../outfits/post.js";
import type * as poses_get from "../poses/get.js";
import type * as poses_post from "../poses/post.js";
import type * as storage_delete from "../storage/delete.js";
import type * as storage_get from "../storage/get.js";
import type * as storage_post from "../storage/post.js";
import type * as wardrobe_delete from "../wardrobe/delete.js";
import type * as wardrobe_get from "../wardrobe/get.js";
import type * as wardrobe_internal from "../wardrobe/internal.js";
import type * as wardrobe_post from "../wardrobe/post.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "chats/delete": typeof chats_delete;
  "chats/get": typeof chats_get;
  "chats/post": typeof chats_post;
  "chats/utils": typeof chats_utils;
  "outfits/get": typeof outfits_get;
  "outfits/post": typeof outfits_post;
  "poses/get": typeof poses_get;
  "poses/post": typeof poses_post;
  "storage/delete": typeof storage_delete;
  "storage/get": typeof storage_get;
  "storage/post": typeof storage_post;
  "wardrobe/delete": typeof wardrobe_delete;
  "wardrobe/get": typeof wardrobe_get;
  "wardrobe/internal": typeof wardrobe_internal;
  "wardrobe/post": typeof wardrobe_post;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
