'use client';

import { useUser } from "@clerk/nextjs";
import { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createComment } from "@/action/createComment";

interface CommentInputProps {
  postId: string;
  parentCommentId?: string;
}

function CommentInput({ postId, parentCommentId }: CommentInputProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      submitComment();
    });
  };

  const submitComment = async () => {
    try {
      const result = await createComment(postId, content, parentCommentId);
      if (result.error) {
        console.error("Error adding comment:", result.error);
      } else {
        setContent("");
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder={user ? "Write a comment..." : "Sign in to comment"}
        disabled={isPending || !user}
        className="flex-grow"
      />
      <button
        type="submit"
        disabled={isPending || !user || content.trim().length === 0}
        className="
          flex-shrink-0
          px-2 py-1 text-sm
          border border-gray-200 dark:border-gray-700
          rounded-[6px]
          text-gray-800 dark:text-[#a7a9ab]
          bg-white dark:bg-[#26282b]
          hover:bg-gray-100 dark:hover:bg-[#404347] dark:hover:border-neutral-600
          shadow-sm dark:shadow-[0_1px_2px_rgba(0,0,0,0.6)]
          transition-all
        "
      >
        {isPending ? "Posting..." : "Post Comment"}
      </button>
    </form>

  );
}

export default CommentInput;
