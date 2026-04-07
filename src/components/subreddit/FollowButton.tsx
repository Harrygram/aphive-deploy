"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  communityId: string;
  userId: string;
}

export default function FollowButton({ communityId, userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const followDocId = `${userId}_${communityId}`;
  const followRef = doc(db, "follows", followDocId);
  const subredditRef = doc(db, "subreddits", communityId);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const snap = await getDoc(followRef);
      setIsFollowing(snap.exists());
    };

    if (userId && communityId) {
      checkFollowStatus();
    }
  }, [followRef, userId, communityId]);

  const handleToggleFollow = async () => {
    if (!userId || !communityId) return;
    setLoading(true);

    try {
      const subredditSnap = await getDoc(subredditRef);
      if (!subredditSnap.exists()) {
        console.error("Subreddit not found");
        return;
      }

      const subredditData = subredditSnap.data();
      const moderatorId = subredditData?.moderatorId;

      // Prevent creator from leaving their own community
      if (isFollowing && userId === moderatorId) {
        alert("You cannot leave a community you created.");
        return;
      }

      if (isFollowing) {
        // Unfollow logic
        await deleteDoc(followRef);
        await updateDoc(subredditRef, {
          num_followers: increment(-1),
        });
        setIsFollowing(false);
      } else {
        // Follow logic
        await setDoc(followRef, {
          userId,
          communityId,
          followedAt: new Date().toISOString(),
        });
        await updateDoc(subredditRef, {
          num_followers: increment(1),
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("❌ Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isFollowing === null) return null;

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`${
        isFollowing
          ? "bg-[#a3140a] border text-white hover:bg-[#801109] dark:text-white dark:hover:bg-[#801109]"
          : "bg-[#0057FF] text-white hover:bg-[#004ae0] dark:bg-[#0057FF] dark:hover:bg-[#004ae0]"
      } rounded-md px-4 py-2 text-sm font-medium transition-colors`}
    >
      {loading ? "Loading..." : isFollowing ? "Leave" : "Join"}
    </Button>
  );
}
