import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


export async function getCommentReplies(commentId: string, userId: string | null) {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('parentCommentId', '==', commentId)
    );

    const commentsSnapshot = await getDocs(commentsQuery);

    const comments = await Promise.all(
      commentsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const commentId = doc.id;

        // Convert Firestore Timestamp to ISO string
        let createdAtISO = new Date().toISOString();
        if (data.createdAt?.toDate) {
          createdAtISO = data.createdAt.toDate().toISOString();
        }

        // fetch votes for this comment
        const votesQuery = query(
          collection(db, 'votes'),
          where('commentId', '==', commentId)
        );

        const voteSnapshot = await getDocs(votesQuery);
        const votesData = voteSnapshot.docs.map((voteDoc) => voteDoc.data());

        const upvotes = votesData.filter((v) => v.voteType === 'upvote').length;
        const downvotes = votesData.filter((v) => v.voteType === 'downvote').length;
        const netScore = upvotes - downvotes;

        const userVote = votesData.find((v) => v.userId === userId)?.voteType || null;

        return {
          _id: commentId,
          postId: data.postId ?? '',
          userId: data.userId ?? '',
          username: data.author?.name || 'Anonymous',
          content: data.content ?? '[No content]',
          parentCommentId: data.parentId ?? null,
          createdAt: createdAtISO,
          isDeleted: data.isDeleted === true,
          author: {
            name: data.author?.name || 'Anonymous',
            imageUrl: data.author?.imageUrl || '',
            email: data.author?.email || '',
            id: data.author?.id || '',
         },

          votes: {
            upvotes,
            downvotes,
            netScore,
            voteStatus: userVote,
          },
        };
      })
    );

    return comments;
  } catch (error) {
    console.error('Error fetching comment replies:', error);
    return [];
  }
}


