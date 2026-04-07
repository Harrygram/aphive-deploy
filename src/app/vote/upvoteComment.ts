import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // assumes you’ve initialized Firestore here

export async function upvoteComment(commentId: string, userId: string) {
  const voteRef = doc(db, "votes", `${commentId}_${userId}`);
  const voteSnap = await getDoc(voteRef);

  if (voteSnap.exists()) {
    const voteData = voteSnap.data();

    if (voteData.voteType === "upvote") {
      // Cancel the upvote
      await deleteDoc(voteRef);
      return;
    }

    if (voteData.voteType === "downvote") {
      // Change downvote to upvote
      await setDoc(voteRef, {
        commentId,
        userId,
        voteType: "upvote",
        createdAt: new Date().toISOString(),
      });
      return;
    }
  }

  // No existing vote, create new upvote
  await setDoc(voteRef, {
    commentId,
    userId,
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}