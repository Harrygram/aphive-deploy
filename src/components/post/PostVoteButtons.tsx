'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { downvote } from "@/action/downvote";
import { upvote } from "@/action/upvote";

interface VoteCounts {
  upvotes: number;
  downvotes: number;
  netScore: number;
}

interface PostVoteButtonsProps {
  contentId: string;
  votes: VoteCounts;
  vote: "upvote" | "downvote" | null;
  contentType?: "post" | "comment";
}

function PostVoteButtons({
  contentId,
  votes,
  vote,
  contentType = "post",
}: PostVoteButtonsProps) {
  const { user, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();

  const [optimisticVote, setOptimisticVote] = useState<"upvote" | "downvote" | null>(vote);
  const [optimisticScore, setOptimisticScore] = useState<number>(votes.netScore);

  const handleUpvote = () => {
    if (!isSignedIn || isPending || !user) return;

    let scoreChange = 0;
    switch (optimisticVote) {
      case "upvote":
        scoreChange = -1;
        setOptimisticVote(null);
        break;
      case "downvote":
        scoreChange = 2;
        setOptimisticVote("upvote");
        break;
      default:
        scoreChange = 1;
        setOptimisticVote("upvote");
    }

    setOptimisticScore((prev) => prev + scoreChange);

    startTransition(async () => {
      try {
        await upvote(contentId, contentType);
      } catch (error) {
        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error(`Failed to upvote ${contentType}:`, error);
      }
    });
  };

  const handleDownvote = () => {
    if (!isSignedIn || isPending || !user) return;

    let scoreChange = 0;
    switch (optimisticVote) {
      case "downvote":
        scoreChange = 1;
        setOptimisticVote(null);
        break;
      case "upvote":
        scoreChange = -2;
        setOptimisticVote("downvote");
        break;
      default:
        scoreChange = -1;
        setOptimisticVote("downvote");
    }

    setOptimisticScore((prev) => prev + scoreChange);

    startTransition(async () => {
      try {
        await downvote(contentId, contentType);
      } catch (error) {
        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error(`Failed to downvote ${contentType}:`, error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-neutral-800 px-3 py-4 rounded-l-md">
      {/* Upvote Button */}
      <button
        disabled={!isSignedIn || isPending || !user}
        onClick={handleUpvote}
        className={`p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed
          ${optimisticVote === "upvote" ? "bg-green-100 dark:bg-green-700" : "hover:bg-gray-200 dark:hover:bg-green-800"}
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowUp
          className={`w-5 h-5 ${
            optimisticVote === "upvote"
              ? "text-green-500 dark:text-green-300"
              : "text-gray-400 hover:text-green-500 dark:hover:text-green-300"
          }`}
        />
      </button>

      {/* Net Score */}
      <span className="text-sm mt-1 mb-1 text-gray-900 dark:text-white">
        {optimisticScore}
      </span>

      {/* Downvote Button */}
      <button
        disabled={!isSignedIn || isPending || !user}
        onClick={handleDownvote}
        className={`p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed
          ${optimisticVote === "downvote" ? "bg-red-100 dark:bg-red-700" : "hover:bg-gray-200 dark:hover:bg-red-800"}
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowDown
          className={`w-5 h-5 ${
            optimisticVote === "downvote"
              ? "text-red-500 dark:text-red-300"
              : "text-gray-400 hover:text-red-500 dark:hover:text-red-300"
          }`}
        />
      </button>
    </div>
  );
}

export default PostVoteButtons;
  