// components/post/Post.tsx
import type { Post as PostType } from "@/app/posts/getallPosts";
import { getPostComments } from "@/app/vote/getPostComments";
import { getPostVotes } from "@/app/vote/getPostVotes";
import { getPostVoteStatus } from "@/app/vote/getPostVoteStatus";
import { MessageSquare } from "lucide-react";
import CommentInput from "../comment/CommentInput";
import CommentList from "../comment/adminCommentList";
import TimeAgo from "../TimeAgo";
import Image from "next/image";
import PostVoteButtons from "./PostVoteButtons";
import DeleteButton from "../adminDeleteButton";
import Link from "next/link";

export interface PostProps {
  post: PostType;
  userId: string | null;
}

export default async function Post({ post, userId }: PostProps) {
  const votes = await getPostVotes(post._id);
  const vote = await getPostVoteStatus(post._id, userId);
  const rawComments = await getPostComments(post._id, userId);
  const comments = rawComments.map((comment: any) => ({
    ...comment,
    isDeleted: comment.isDeleted ?? false,
  }));

  return (
    <article className="bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-gray-200 hover:border-gray-300 dark:border-none dark:hover:border-none transition-colors">
      <div className="flex">
        <PostVoteButtons contentId={post._id} votes={votes} contentType="post" vote={vote} />
        <div className="flex-1 p-4">
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mb-2">
            <div className="flex items-center gap-2">
              {post.subreddit && (
                <>
                  <Link
                    href={`/admin/community/${post.subreddit.slug}`}
                    className="font-medium hover:underline dark:text-neutral-300"
                  >
                    c/{post.subreddit.title}
                  </Link>
                  <span>•</span>
                </>
              )}
              {post.author && (
                <>
                  <Link
                    href={`/admin/user/${post.author.id}`}
                    className="font-medium text-gray-600 dark:text-neutral-300 hover:underline"
                  >
                    {post.author.name || "Unknown"}
                  </Link>
                  <span>•</span>
                </>
              )}
              {post.publishedAt && (
                <TimeAgo date={new Date(post.publishedAt.seconds * 1000)} />
              )}
            </div>

            {!post.isDeleted && (
              <DeleteButton
                contentOwnerId={post.author?.id || ""}
                contentId={post._id}
                contentType="post"
              />
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>

          {/* Body */}
          {post.body && (
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-neutral-300 mb-3">
              {post.body}
            </div>
          )}

          {/* Image */}
          {post.image?.base64 && (
            <div className="relative w-full h-64 mb-3 px-2 bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.image.base64}
                alt={post.image.filename || "Post image"}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Comments */}
          <button className="flex items-center px-1 py-2 gap-1 text-sm text-gray-500 dark:text-neutral-400">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length} Comments</span>
          </button>
          <CommentInput postId={post._id} />
          <CommentList postId={post._id} comments={comments} userId={userId} />
        </div>
      </div>
    </article>
  );
}
