import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getPostById(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }

    const postData = postSnap.data();

    return {
      _id: postId,
      title: postData.title,
      slug: postData.slug || null,
      body: postData.body,
      publishedAt: postData.publishedAt,
      author: postData.author,         // { id, name, image }
      subreddit: postData.subreddit,   // { id, title }
      image: postData.image,
      isDeleted: postData.isDeleted,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}