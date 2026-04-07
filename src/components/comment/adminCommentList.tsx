'use client';

import Comment from './adminComment';

export interface CommentType {
  isDeleted: boolean;
  _id: string;
  postId: string;
  content: string;
  createdAt: string;
  parentCommentId: string | null;
  userId: string;
  votes: {
    upvotes: number;
    downvotes: number;
    netScore: number;
    voteStatus: string | null;
  };
  author: {
    name: string;
    imageUrl: string;
    email: string;
    id: string;
  };
}


interface CommentListProps {
  postId: string;
  comments: CommentType[];
  userId: string | null;
}

export default function CommentList({ postId, comments, userId }: CommentListProps) {
  const rootComments = comments.filter((c) => !c.parentCommentId);

  return (
    <section className="mt-8">
      {rootComments.length > 0 && (
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Comments ({comments.length})
        </h2>
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-lg bg-white dark:bg-neutral-900">
        {rootComments.length > 0 ? (
          rootComments.map((comment) => (
            <Comment
              key={comment._id}
              postId={postId}
              comment={comment}
              userId={userId}
              allComments={comments}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </section>
  );
}




