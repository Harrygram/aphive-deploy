import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getPostsForSubreddit(subredditId: string) {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("subreddit.id", "==", subredditId),
    where("isDeleted", "==", false),
    orderBy("publishedAt", "desc")
  );

  const postsSnapshot = await getDocs(q);
  const posts = [];

  for (const postDoc of postsSnapshot.docs) {
    const post = postDoc.data();
    const postId = postDoc.id;

    // 🔄 Reuse working logic from getUserCreatedPosts
    let subredditData = {
      id: "",
      title: "",
      slug: "",
    };

    if (post.subreddit?.id) {
      const subredditDocRef = doc(db, "subreddits", post.subreddit.id);
      const subredditDoc = await getDoc(subredditDocRef);

      if (subredditDoc.exists()) {
        const subData = subredditDoc.data();
        subredditData = {
          id: subredditDoc.id,
          title: subData.title ?? "",
          slug: subData.slug ?? "",
        };
      }
    }

    // ✅ Unified publishedAt logic like your working code
    posts.push({
      _id: post._id || postId,
      title: post.title || "",
      slug: post.slug || "",
      body: post.body || post.content || "",
      image: post.image ?? undefined,
      imageAlt: post.imageAlt || "",
      publishedAt: post.publishedAt,
      author: post.author ?? {
        _id: "",
        id: post.author?.id || "",
        name: "",
        imageUrl: "",
      },
      subreddit: subredditData,
      isDeleted: post.isDeleted ?? false,
    });
  }

  return posts;
}
