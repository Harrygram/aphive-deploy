import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserCreatedPosts } from "@/app/posts/getCreatedPosts";
import Post from "@/components/post/Post";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export async function getUserById(userId: string) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  // Debug log for joinedAt field
  console.log("JoinedAt Raw:", data.joinedAt);

  // Convert Firestore Timestamp or fallback if string
  let joinedDate: Date | null = null;

  if (data.joinedAt?.toDate) {
    joinedDate = data.joinedAt.toDate(); // Firestore Timestamp
  } else if (typeof data.joinedAt === "string") {
    joinedDate = new Date(data.joinedAt); // ISO string
  }

  return {
    id: userId,
    username: data.username || "Unknown",
    email: data.email || "",
    avatar: data.imageUrl || "",
    joinedAt: joinedDate,
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

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const profile = await getUserById(id);
  const viewer = await currentUser();

  if (!profile) return <p className="text-center p-4">User not found.</p>;

  const posts = await getUserCreatedPosts(id);

  return (
    <>
      <section className="bg-white dark:bg-black border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border bg-gray-100">
              {profile.avatar &&
                (profile.avatar.endsWith(".gif") || profile.avatar.endsWith(".webp") ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <Image
                    src={profile.avatar}
                    alt={profile.username}
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                ))}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-500">Joined: {formatDate(profile.joinedAt)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post._id} post={post} userId={viewer?.id || null} />
              ))
            ) : (
              <div className="bg-white rounded-md p-6 text-center">
                <p className="text-gray-500">This user hasn’t posted anything yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
