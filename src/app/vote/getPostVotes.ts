import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";  // your Firestore db instance

interface VoteCounts {
  upvotes: number;
  downvotes: number;
  netScore: number;
}

export async function getPostVotes(postId: string): Promise<VoteCounts> {
  const votesRef = collection(db, "votes");

  // Query for upvotes
  const upvotesQuery = query(
    votesRef,
    where("postId", "==", postId),
    where("voteType", "==", "upvote")
  );

  // Query for downvotes
  const downvotesQuery = query(
    votesRef,
    where("postId", "==", postId),
    where("voteType", "==", "downvote")
  );

  // Fetch documents for upvotes and downvotes
  const [upvotesSnap, downvotesSnap] = await Promise.all([
    getDocs(upvotesQuery),
    getDocs(downvotesQuery),
  ]);

  const upvotesCount = upvotesSnap.size;
  const downvotesCount = downvotesSnap.size;
  const netScore = upvotesCount - downvotesCount;

  return {
    upvotes: upvotesCount,
    downvotes: downvotesCount,
    netScore,
  };
}
