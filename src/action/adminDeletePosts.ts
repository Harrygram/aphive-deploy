"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { currentUser } from "@clerk/nextjs/server";
import { getPostById } from "@/app/posts/getPostById";

export const deletePost = async (postId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }

  const post = await getPostById(postId);
  if (!post) {
    return { error: "Post not found" };
  }

  console.log(post.author?.id, user.id);

  const postRef = doc(db, "posts", postId);

  try {
    await updateDoc(postRef, {
      isDeleted: true,
      title: "The post has been deleted",
      body: "This post was removed by the admin.",
      image: null,
    });

    // Optional delay for UI transition
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: "Post has been deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post" };
  }
};