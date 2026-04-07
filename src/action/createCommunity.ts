'use server';

import { createSubreddit } from "@/app/subreddit/createSubreddit";
import { getUser } from "@/app/user/getUser";
import type { Subreddit } from "@/app/subreddit/getSubreddits"; // Make sure this is imported

export type ImageData = {
  base64: string;
  filename: string;
  contentType: string;
} | null;

export async function createCommunity(
  name: string,
  imageBase64: string | null | undefined,
  imageFilename: string | null | undefined,
  imageContentType: string | null | undefined,
  slug?: string,
  description?: string
): Promise<{ subreddit?: Subreddit; error?: string }> {
  try {
    const user = await getUser();

    if ("error" in user) {
      return { error: user.error };
    }

    let imageData: ImageData = null;
    if (imageBase64 && imageFilename && imageContentType) {
      imageData = {
        base64: imageBase64,
        filename: imageFilename,
        contentType: imageContentType,
      };
    }

    const result = await createSubreddit(
      name,
      user._id,
      imageData,
      slug,
      description,
    );

    return result;

  } catch (error) {
    console.error("Error in createCommunity", error);
    return { error: "Failed to create community" };
  }
}
