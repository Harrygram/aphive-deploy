import React from 'react';
import "tw-animate-css";
import JoinedPostsList from '@/components/post/joinedPostsList';
import AllPostsList from '@/components/post/PostsList';

export default async function Home({ searchParams }: { searchParams: { view?: string } }) {
  const viewParam = searchParams?.view;
  const view = viewParam === 'joined' ? 'joined' : 'all';

  return (
    <>
      {/* Banner Section */}
      <section className="bg-white border-b dark:bg-black dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {view === 'joined'
                ? 'Recent posts from joined communities'
                : 'Recent posts from all communities'}
            </p>
          </div>

          {/* View toggle buttons */}
          <div className="flex gap-2">
            <a
              href="/home?view=joined"
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                view === 'joined'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 dark:bg-black dark:text-gray-300 dark:border-gray-700 border-gray-300'
              }`}
            >
              Joined
            </a>
            <a
              href="/home?view=all"
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                view === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 dark:bg-black dark:text-gray-300 dark:border-gray-700 border-gray-300'
              }`}
            >
              All
            </a>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto px-4 py-6">
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            {view === 'joined' ? <JoinedPostsList /> : <AllPostsList />}
          </div>
        </div>
      </section>
    </>
  );
}
