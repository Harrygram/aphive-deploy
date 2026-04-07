import React from "react";
import { getPosts } from "@/app/posts/getallPosts";
import { getPostVotes } from "@/app/vote/getPostVotes";
import { Button } from "@/components/ui/button";
import "tw-animate-css";
import PostsList from "@/components/post/postVoteList";
import type { Post } from "@/app/posts/getallPosts";

export default async function Home() {
  const posts = await getPosts();

  const postsWithVotes = await Promise.all(
    posts.map(async (post) => {
      const votes = await getPostVotes(post._id);
      return {
        ...post,
        voteCount: votes.netScore,
      };
    })
  );

  const sortedPosts = postsWithVotes.sort((a, b) => b.voteCount - a.voteCount);

  return (
    <>
      {/* Banner Section */}
      <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Top Posts</h1>
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                Popular posts from all communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto px-4 py-6 max-w-7xl">
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            <PostsList posts={sortedPosts} />
          </div>
        </div>
      </section>
    </>
  );
}
