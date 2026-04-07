import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function getCommunities() {
  const ref = collection(db, "subreddits"); // or "communities" if renamed
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    let createdAt: Date | null = null;

    // Handle both Firestore Timestamp and ISO string
    if (data.createdAt?.toDate) {
      createdAt = data.createdAt.toDate(); // Firestore Timestamp
    } else if (typeof data.createdAt === "string") {
      createdAt = new Date(data.createdAt); // ISO string
    }

    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      slug: data.slug,
      createdAt,
    };
  });
}
