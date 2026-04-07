import { collection, getDocs, query, where, doc, getDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Subreddit {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: {
    base64: string;
    filename: string;
    contentType: string;
  };
  moderatorId: string;
  num_followers: number;
  createdAt?: Date | string | null;
}

export async function getJoinedSubreddits(userId: string): Promise<Subreddit[]> {
  const followsRef = collection(db, "follows");
  const q = query(followsRef, where("userId", "==", userId));
  const snap = await getDocs(q);

  const subreddits: Subreddit[] = [];

  for (const docSnap of snap.docs) {
    const { communityId } = docSnap.data();

    const communityRef = doc(db, "subreddits", communityId);
    const communitySnap = await getDoc(communityRef);

    if (communitySnap.exists()) {
      const data = communitySnap.data();
      subreddits.push({
        _id: communitySnap.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image,
        moderatorId: data.moderatorId,
        num_followers: data.num_followers ?? 1,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
      });
    }
  }

  return subreddits;
}
