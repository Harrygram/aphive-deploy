'use client';

import { deleteComment } from "@/action/adminDeleteComment";
import { deletePost } from "@/action/adminDeletePosts";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  contentId: string;
  contentType: string;
  contentOwnerId: string;
}

function DeleteButton({
  contentId,
  contentType,
  contentOwnerId,
}: DeleteButtonProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  const handleDelete = async () => {
    if (isDeleted || !isSignedIn) return;
    if (!window.confirm("Are you sure you want to proceed with this deletion?")) {
      return;
    }
    setIsDeleted(true);
    setError(null);

    try {
      const response =
        contentType === "post"
          ? await deletePost(contentId)
          : await deleteComment(contentId);

      if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      setError("Failed to delete. Please try again.");
      console.error(`Failed to delete ${contentType}:`, error);
    } finally {
      setIsDeleted(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleted || !isSignedIn}
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-450
           hover:text-red-600 dark:hover:text-red-500 
           transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Delete ${contentType}`}
    >
      <Trash2 size={14} />
      <span className="hidden md:block">
        {isDeleted
          ? "Deleting..."
          : isSignedIn
          ? "Delete"
          : "Sign in to delete"}
      </span>
      {error && <span className="text-red-900 dark:text-red-500 ml-2">{error}</span>}
    </button>
  );
}

export default DeleteButton;
