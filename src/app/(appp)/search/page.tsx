import React from 'react';
import Link from 'next/link';
import { searchSubreddits } from '@/app/subreddit/searchSubreddits';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Subreddit = {
  id: string;
  title?: string;
  description?: string;
  slug?: string;
  image?: {
    base64: string;
    contentType?: string;
    filename?: string;
  };
};


// Updated: Make props an async function parameter
export default async function SearchPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedParams = await props.searchParams;
  const rawQuery = resolvedParams?.query;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? '';

  const subreddits: Subreddit[] = await searchSubreddits(query);

  return (
    <>
      <section className="bg-white dark:bg-black border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Search Results ({subreddits.length})
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Communities matching &quot;{query}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="space-y-4">
            {subreddits.length > 0 ? (
              subreddits.map((subreddit) => (
                <li
                  key={subreddit.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                >
                  <Link
                    href={`/community/${subreddit.slug ?? subreddit.id}`}
                    className="flex items-center dark:bg-[#191a1c] gap-4 py-5 px-4 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                  >
                    <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-800">
                      {subreddit.image ? (
                        <AvatarImage
                          src={subreddit.image.base64}
                          className="object-contain"
                          alt={subreddit.title ?? 'Community'}
                        />
                      ) : (
                        <AvatarFallback className="text-lg font-semibold bg-red-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          {subreddit.title?.charAt(0)?.toUpperCase() ?? 'C'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">{subreddit.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {subreddit.description ?? 'No description available.'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg">
                No communities found matching your search.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}



