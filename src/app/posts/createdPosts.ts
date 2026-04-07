import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Post {
  _id: string;
  title: string;
  content: string;
  image?: {
    base64: string;
    filename: string;
    contentType: string;
  };
  authorId: string;
  subredditId: string;
  createdAt?: Date | string | null;
  voteCount: number;
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("authorId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  const posts: Post[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    posts.push({
      _id: docSnap.id,
      title: data.title,
      content: data.content,
      image: data.image,
      authorId: data.authorId,
      subredditId: data.subredditId,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
      voteCount: data.voteCount ?? 0,
    });
  }

  return posts;
}
