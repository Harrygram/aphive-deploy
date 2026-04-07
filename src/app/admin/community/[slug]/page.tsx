import { getPostsForSubreddit } from "@/app/subreddit/getPostsForSubreddit";
import { getSubredditSlug } from "@/app/subreddit/getSubredditsSlug";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Post from "@/components/post/adminPosts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getUserById(userId: string) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.warn("User not found for ID:", userId);
    return null;
  }

  const data = snap.data();
  return {
    id: userId,
    username: data.username || "Unknown",
    email: data.email || "",
    avatar: data.imageUrl || "",
  };
}

function formatDate(date: Date | null) {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

async function CommunityPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const community = await getSubredditSlug(slug);
  if (!community) return null;

  const createdAt = community.createdAt as Date | null;
  const creator = community.moderatorId
    ? await getUserById(community.moderatorId)
    : null;

  const user = await currentUser();
  const posts = await getPostsForSubreddit(community.id);

  return (
    <>
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              {/* Community Title + Creator Box */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-gray-100">
                  {community.image?.base64 && (
                    <Image
                      src={community.image.base64}
                      alt={`${community.title} community icon`}
                      fill
                      className="object-contain"
                      priority
                    />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold">c/{community.title}</h1>

                  {/* Creator Box */}
                  <div className="rounded-md px-3 py-2 text-sm flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border bg-white">
                      {creator?.avatar &&
                        (creator.avatar.endsWith(".gif") ||
                        creator.avatar.endsWith(".webp") ? (
                          <img
                            src={creator.avatar}
                            alt={creator.username}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <img
                            src={creator.avatar}
                            alt={creator.username}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ))}
                    </div>

                    <div className="flex flex-col leading-tight">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{creator?.username}</p>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          creator
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{creator?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Info */}
              <div className="flex flex-col sm:flex-row -mt-5 gap-4">
                <div className="max-w-lg w-full bg-white px-21 py-0">
                  {community.description && (
                    <p
                      className="text-sm text-gray-700 dark:text-gray-400 mb-3 whitespace-pre-line"
                    >
                      {community.description}
                    </p>
                  )}
                  <div className="text-sm text-gray-600 -mt-2">
                    <p>
                      <strong>Created on:</strong> {formatDate(createdAt)}
                    </p>
                    <p>
                      <strong>Members:</strong> {community.num_followers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post._id} post={post} userId={user?.id || null} />
              ))
            ) : (
              <div className="bg-white rounded-md p-6 text-center">
                <p className="text-gray-500">No posts in this community yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default CommunityPage;
