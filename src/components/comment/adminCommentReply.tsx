'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CommentType } from './CommentList';
import DeleteButton from '../adminDeleteButton';

interface CommentReplyProps {
  postId: string;
  comment: CommentType;
}

function CommentReply({ postId, comment }: CommentReplyProps) {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col gap-2">
      {/* Show Delete button only if comment is not deleted */}
      {comment.isDeleted !== true && (
        <div className="flex items-center gap-2">
          <DeleteButton
            contentOwnerId={comment.author?.id}
            contentId={comment._id}
            contentType="comment"
          />
        </div>
      )}
    </div>
  );
}

export default CommentReply;
