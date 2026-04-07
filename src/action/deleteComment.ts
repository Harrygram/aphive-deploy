"use server";

import { currentUser } from "@clerk/nextjs/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
// Update the import path below to the correct relative path based on your project structure
import { getCommentById } from "../app/posts/getCommentById";

export const deleteComment = async (commentId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }

  const comment = await getCommentById(commentId);
  if (!comment) {
    return { error: "Comment not found" };
  }

  if (comment.author?.id !== user.id) {
    return { error: "You are not authorized to delete this comment" };
  }

  const commentRef = doc(db, "comments", commentId);

  try {
    await updateDoc(commentRef, {
      isDeleted: true,
      content: "This comment has been deleted by the author.",
    });

    // Optional delay for UI effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: "Comment has been deleted successfully" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
};

