// This function checks if a user has voted on a specific post and returns the type of vote ("upvote", "downvote") or null if no vote exists.
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this is your Firestore instance

export async function getPostVoteStatus(
  postId: string,
  userId: string | null
): Promise<"upvote" | "downvote" | null> {
  if (!userId) return null;

  const votesRef = collection(db, "votes");

  const voteQuery = query(
    votesRef,
    where("postId", "==", postId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(voteQuery);

  if (!snapshot.empty) {
    const voteData = snapshot.docs[0].data();
    return voteData.voteType === "upvote" ? "upvote" : "downvote";
  }

  return null;
}
