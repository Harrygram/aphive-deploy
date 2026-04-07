import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // assumes you’ve initialized Firestore here

export async function downvotePost(postId: string, userId: string) {
  const voteRef = doc(db, "votes", `${postId}_${userId}`);
  const voteSnap = await getDoc(voteRef);

  if (voteSnap.exists()) {
    const voteData = voteSnap.data();

    if (voteData.voteType === "downvote") {
      // Cancel the upvote
      await deleteDoc(voteRef);
      return;
    }

    if (voteData.voteType === "upvote") {
      // Change downvote to upvote
      await setDoc(voteRef, {
        postId,
        userId,
        voteType: "downvote",
        createdAt: new Date().toISOString(),
      });
      return;
    }
  }

  // No existing vote, create new upvote
  await setDoc(voteRef, {
    postId,
    userId,
    voteType: "downvote",
    createdAt: new Date().toISOString(),
  });
}