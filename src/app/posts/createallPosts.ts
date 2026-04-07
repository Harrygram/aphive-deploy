// posts/createAllPosts.ts
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp, writeBatch, doc } from "firebase/firestore";

interface Author {
  id: string;
  name?: string;
  image?: string;
}

interface Subreddit {
  id: string;
  title: string;
  slug: string; 
}

interface PostInput {
  title: string;
  slug: string;
  body: string;
  image?: string;
  author: Author;
  subreddit: Subreddit;
  isDeleted?: boolean;
}

export async function createPost(postData: PostInput): Promise<{ success: boolean; error?: string }> {
  try {
    const postsRef = collection(db, "posts");

    const newPost = {
      ...postData,
      publishedAt: Timestamp.now(),
      isDeleted: postData.isDeleted ?? false,
    };

    await addDoc(postsRef, newPost);

    return { success: true };
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

