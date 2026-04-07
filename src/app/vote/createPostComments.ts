import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

// Create a new comment in Firestore
export async function createPostComment(
  postId: string,
  userId: string,
  content: string,
  parentCommentId: string | null = null
): Promise<string> {
  const newComment = {
    postId,
    userId,
    content,
    parentCommentId: parentCommentId || null,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "comments"), newComment);

  return docRef.id; // Returns the new comment's document ID
}
