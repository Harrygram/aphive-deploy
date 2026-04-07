import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Subreddit {
  _id: string;              // Firestore document ID
  title: string;
  slug: string;
  description: string;
  image?: {                 // optional image object
    base64: string;
    filename: string;
    contentType: string;
  };
  moderatorId: string;      // moderator's user ID
  num_followers: number;    // required field
  createdAt?: string | null; // Firestore Timestamp or string or null
}

export async function getSubreddits(): Promise<Subreddit[]> {
  const subredditsRef = collection(db, "subreddits");
  const q = query(subredditsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      _id: doc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      image: data.image,
      moderatorId: data.moderatorId,
      num_followers: data.num_followers ?? 1, // add this field with default fallback
      createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
    };
  });
}
