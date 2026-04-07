import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUser } from "../user/getUser";

interface AddCommentParams {
  content: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
}

export async function addComment({
  content,
  postId,
  userId,
  parentCommentId,
}: AddCommentParams) {
  try {
    // Get full user info
    const user = await getUser();
    if ('error' in user) throw new Error(user.error);

    const commentData = {
      content,
      postId,
      userId,
      parentCommentId: parentCommentId || null,
      createdAt: serverTimestamp(),
      author: {
        name: user.username,
        imageUrl: user.imageUrl,
        email: user.email,
        id: user._id
      }
    };

    const docRef = await addDoc(collection(db, "comments"), commentData);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}


