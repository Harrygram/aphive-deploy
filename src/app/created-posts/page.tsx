import React from "react";
import "tw-animate-css";
import CreatedPostsList from "@/components/post/getUserPosts";

export default function CreatedPostsPage() {
  return (
    <>
      {/* Banner Section */}
      <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Posts</h1>
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                Posts you've created recently
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto px-4 py-6 max-w-7xl">
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            <CreatedPostsList />
          </div>
        </div>
      </section>
    </>
  );
}
