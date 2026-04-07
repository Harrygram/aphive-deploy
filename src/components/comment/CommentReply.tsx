'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import CommentInput from './CommentInput';
import { MessageCircle } from 'lucide-react';
import { CommentType } from './CommentList';
import DeleteButton from '../DeleteButton';

interface CommentReplyProps {
  postId: string;
  comment: CommentType;
}

function CommentReply({ postId, comment }: CommentReplyProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { user, isSignedIn } = useUser();

  const isAuthor = user && comment && user.id === comment.userId;

  return (
    <div className="flex flex-col gap-2">
      {/* Show buttons only if comment is not deleted */}
      {comment.isDeleted !== true && (
        <div className="flex items-center gap-2">
          {/* Reply Button */}
          <button
            className="flex items-center gap-1.5 text-xs font-medium dark:text-gray-450 text-gray-500 
              hover:text-green-500 dark:hover:text-green-500 transition-colors mt-1 disabled:opacity-50"
            onClick={() => setIsReplying((prev) => !prev)}
            disabled={!isSignedIn}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {isReplying ? 'Cancel' : isSignedIn ? 'Reply' : 'Sign in to reply'}
          </button>

          {/* Delete Button (only show to author) */}
          {comment.author?.id && (
            <DeleteButton
              contentOwnerId={comment.author?.id}
              contentId={comment._id}
              contentType="comment"
            />
          )}
        </div>
      )}

      {/* Reply input field (only if not deleted) */}
      {comment.isDeleted !== true && isReplying && (
        <div className="mt-3 ps-2 border-s-4 border-gray-100">
          <CommentInput postId={postId} parentCommentId={comment._id} />
        </div>
      )}
    </div>
  );
}

export default CommentReply;
