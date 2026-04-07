'use server';

import { getSubredditSlug } from "@/app/subreddit/getSubredditsSlug";
import { getUser } from "@/app/user/getUser";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export async function createPost({
  title,
  subredditSlug,
  body,
  imageBase64,
  imageFilename,
  imageContentType,
}: {
  title: string;
  subredditSlug: string;
  body?: string;
  imageBase64?: string | null;
  imageFilename?: string | null;
  imageContentType?: string | null;
}) {
  if (!title || !subredditSlug) {
    return { error: "Title and subreddit slug are required." };
  }

  const user = await getUser();
  if ("error" in user) {
    return { error: user.error };
  }

  const subreddit = await getSubredditSlug(subredditSlug);
  if (!subreddit) {
    return { error: `Subreddit with slug "${subredditSlug}" not found.` };
  }

  let image: { base64: string; contentType: string; filename: string } | null = null;
  if (imageBase64 && imageFilename && imageContentType) {
    image = {
      base64: imageBase64,
      contentType: imageContentType,
      filename: imageFilename,
    };
  }

  const postData = {
    author: {
      id: user._id,
      name: user.username ?? user.username,
      image: user.imageUrl || null,
    },
    title,
    body: body || "",
    image,
    isDeleted: false,
    subreddit: {
      id: subreddit.id,
      title: subreddit.title,
      slug: subreddit.slug, // ✅ Include slug for routing
    },
    publishedAt: serverTimestamp(),
  };

  try {
    const postsRef = collection(db, "posts");
    await addDoc(postsRef, postData);
    return { success: true };
  } catch (e) {
    console.error("❌ Error creating post:", e);
    return { error: "Failed to create post." };
  }
}
