import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";

const FIREBASE_BUCKET = "aphive.appspot.com";

interface Subreddit {
  id: string;
  title: string;
  description: string;
  slug?: string;
  num_followers?: number;
  image?: string | {
    base64?: string;
    filename?: string;
    contentType?: string;
  };
}

function getImageUrl(image: Subreddit["image"], title: string): string {
  if (!image) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}`;
  }

  if (typeof image === "string") {
    return image;
  }

  if (image.base64) {
    return image.base64;
  }

  if (image.filename) {
    return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodeURIComponent(
      image.filename
    )}?alt=media`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}`;
}

async function getSubreddits(): Promise<Subreddit[]> {
  const q = query(collection(db, "subreddits"), orderBy("num_followers", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Subreddit, "id">),
  }));
}

export default async function CommunitiesPage() {
  const subreddits = await getSubreddits();

  return (
    <main className="flex-1 p-6 min-h-screen bg-gray-50 dark:bg-black">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Trending Communities
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {subreddits.map((sub) => (
          <Link
            key={sub.id}
            href={`/community/${sub.slug ?? sub.id}`}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] hover:bg-gray-100 dark:hover:bg-neutral-800 transition-transform duration-300 p-6 flex flex-col items-center text-center min-h-[360px] max-w-xs mx-auto w-full"
          >
            <div className="w-34 h-34 rounded-full overflow-hidden border shadow-sm mb-4">
              <img
                src={getImageUrl(sub.image, sub.title)}
                alt={sub.title}
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {sub.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-neutral-300 break-words">
              {sub.description || "No description yet."}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">
              {sub.num_followers ?? 0} Members
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
