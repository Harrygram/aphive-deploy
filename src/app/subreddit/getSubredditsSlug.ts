import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getSubredditSlug(slug: string) {
  const subredditsRef = collection(db, "subreddits");
  const q = query(subredditsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  // ✅ Properly handle both Timestamp and ISO string
  let createdAt: Date | null = null;
  if (data.createdAt?.toDate) {
    createdAt = data.createdAt.toDate();
  } else if (typeof data.createdAt === "string") {
    createdAt = new Date(data.createdAt);
  }

  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    createdAt,
    moderatorId: data.moderatorId || null,
    image: data.image || null,
    num_followers: data.num_followers ?? 0,
  };
}
