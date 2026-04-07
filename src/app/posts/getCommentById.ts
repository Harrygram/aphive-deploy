import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getCommentById(commentId: string) {
  try {
    const commentRef = doc(db, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      throw new Error("Comment not found");
    }

    const data = commentSnap.data();

    return {
      _id: commentSnap.id,
      content: data.content,
      createdAt: data.createdAt,
      isDeleted: data.isDeleted,
      author: {
        id: data.author?.id,
        name: data.author?.name,
        email: data.author?.email,
        imageUrl: data.author?.imageUrl,
      },
    };
  } catch (error) {
    console.error("Error fetching comment:", error);
    return null;
  }
}

