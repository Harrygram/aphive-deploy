import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Comment {
  _id: string;
  postId: string;
  content: string;
  createdAt: string;
  parentCommentId: string | null;
  userId: string;
  isDeleted: boolean; // ✅ Added here
  votes: {
    upvotes: number;
    downvotes: number;
    netScore: number;
    voteStatus: "upvote" | "downvote" | null;
  };
  author: {
    name: string;
    imageUrl: string;
    email: string;
    id: string;
  };
}

export async function getPostComments(
  postId: string,
  userId: string | null
): Promise<Comment[]> {
  try {
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );

    const commentsSnapshot = await getDocs(commentsQuery);

    const comments: Comment[] = await Promise.all(
      commentsSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const commentId = docSnap.id;

        // Convert Firestore Timestamp to ISO string
        let createdAtISO = new Date().toISOString();
        if (data.createdAt?.toDate) {
          createdAtISO = data.createdAt.toDate().toISOString();
        }

        // fetch votes for this comment
        const votesQuery = query(
          collection(db, "votes"),
          where("commentId", "==", commentId)
        );

        const voteSnapshot = await getDocs(votesQuery);
        const votesData = voteSnapshot.docs.map((voteDoc) => voteDoc.data());

        const upvotes = votesData.filter((v) => v.voteType === "upvote").length;
        const downvotes = votesData.filter((v) => v.voteType === "downvote").length;
        const netScore = upvotes - downvotes;
        const voteStatus = votesData.find((v) => v.userId === userId)?.voteType || null;

        return {
          _id: commentId,
          postId: data.postId ?? "",
          userId: data.userId ?? "",
          content: data.content ?? "[No content]",
          parentCommentId: data.parentCommentId ?? null,
          createdAt: createdAtISO,
          isDeleted: !!data.isDeleted, // ✅ Included here
          author: {
            name: data.author?.name || "Anonymous",
            imageUrl: data.author?.imageUrl || "",
            email: data.author?.email || "",
            id: data.author?.id || "",
          },
          votes: {
            upvotes,
            downvotes,
            netScore,
            voteStatus,
          },
        };
      })
    );

    return comments;
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return [];
  }
}
