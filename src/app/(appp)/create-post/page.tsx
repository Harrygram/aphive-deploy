import { getSubreddits } from '@/app/subreddit/getSubreddits';
import { getSubredditSlug } from '@/app/subreddit/getSubredditsSlug';
import CreateCommunityButton from '@/components/header/CreateCommunityButton';
import React from 'react';
import { SubredditCombobox } from '@/components/subreddit/SubredditCombobox';
import CreatePostForm from '@/components/post/CreatePostForm';

// ✅ Correctly type the searchParams prop
type CreatePostPageProps = {
  searchParams?: {
    subreddit?: string;
  };
};

export default async function CreatePostPage({ searchParams }: CreatePostPageProps) {
  const subreddit = searchParams?.subreddit; // ✅ Use optional chaining
  const subreddits = await getSubreddits();

  const subredditData = subreddit ? await getSubredditSlug(subreddit) : null;

  return (
    <>
      {/* Banner */}
      <section className="bg-white dark:bg-black border-b dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Create Post</h1>
              {subredditData ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create a post in the{' '}
                  <span className="font-bold">{subredditData.title}</span> community
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select a community for your post
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Select community if no valid subreddit */}
      {!subredditData && (
        <section className="my-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-4">
              <div className="max-w-3xl">
                <label className="block text-sm font-medium mb-2">
                  Select a community to post in
                </label>
                <SubredditCombobox subreddits={subreddits} />
                <hr className="my-4" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  If you don&apos;t see your community, you can create it here.
                </p>
                <div className="mt-2">
                  <CreateCommunityButton />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Show form only when subreddit slug is valid */}
      {subredditData && (
        <section className="my-8">
          <CreatePostForm />
        </section>
      )}
    </>
  );
}
