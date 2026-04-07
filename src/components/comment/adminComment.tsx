'use client';

import React, { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import TimeAgo from '../TimeAgo';
import { getCommentReplies } from '@/app/comment/getCommentReplies';
import CommentList, { CommentType } from './CommentList';
import CommentReply from './adminCommentReply';
import PostVoteButtons from '../post/PostVoteButtons';

interface CommentProps {
  postId: string;
  comment: CommentType;
  userId: string | null;
  allComments: CommentType[];
}

const Comment: React.FC<CommentProps> = ({ postId, comment, userId, allComments }) => {
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [locallyDeleted, setLocallyDeleted] = useState(false); // ✅ new

  const isCommentDeleted = locallyDeleted || comment.isDeleted; // ✅ computed value

  useEffect(() => {
    async function fetchReplies() {
      try {
        const fetchedReplies = await getCommentReplies(comment._id, userId);
        console.log('Fetched replies:', fetchedReplies);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error('Error fetching comment replies:', error);
      }
    }

    fetchReplies();
  }, [comment._id, userId]);

  return (
    <article className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex gap-4">
        {/* Vote Buttons */}
        <PostVoteButtons
          contentId={comment.postId}
          votes={comment.votes}
          contentType="comment"
          vote={null}
        />

        <div className="flex-1 space-y-2">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            {comment.author?.imageUrl ? (
              <img
                src={comment.author.imageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-300" />
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {comment.author?.name || 'Anonymous'}
              </span>
              {comment.createdAt && (
                <span className="text-xs text-gray-500">
                  <TimeAgo date={new Date(comment.createdAt)} />
                </span>
              )}
            </div>
          </div>

          {/* Comment Content */}
          {isCommentDeleted ? (
            <p className="italic text-gray-400">
              {comment.content || 'This comment has been deleted by the admin.'}
            </p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-neutral-400">{comment.content}</p>
              <CommentReply postId={postId} comment={comment} />
            </>
          )}

          {/* Recursive Replies */}
          {replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-3">
              {replies.map((reply) => (
                <Comment
                  key={reply._id}
                  postId={postId}
                  comment={reply}
                  userId={userId}
                  allComments={allComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Comment;
