import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";

interface VoteData {
  postId: string;
  userId: string;
  voteType: "upvote" | "downvote";
}

export async function createPostVote({ postId, userId, voteType }: VoteData): Promise<void> {
  const votesRef = collection(db, "votes");

  // Check if the user has already voted on this post
  const existingVoteQuery = query(
    votesRef,
    where("postId", "==", postId),
    where("userId", "==", userId)
  );

  const existingVoteSnap = await getDocs(existingVoteQuery);

  if (!existingVoteSnap.empty) {
    // Update existing vote (only one vote per user per post allowed)
    const existingVoteDoc = existingVoteSnap.docs[0];
    await setDoc(doc(db, "votes", existingVoteDoc.id), {
      postId,
      userId,
      voteType,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } else {
    // Create a new vote
    const newVoteId = `${postId}_${userId}`;
    await setDoc(doc(db, "votes", newVoteId), {
      postId,
      userId,
      voteType,
      createdAt: serverTimestamp(),
    });
  }
}
