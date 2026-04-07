import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  body: string;
  image?: {
    base64: string;
    contentType: string;
    filename: string;
  };
  imageAlt: string;
  publishedAt: any;
  author: {
    _id: any;
    imageUrl: string | StaticImport;
    id: string;
    name?: string;
    image?: string;
  };
  subreddit: {
    id: string;
    title: string;
    slug: string;
  };
  isDeleted: boolean;
}

export async function getPosts(): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  const postsQuery = query(
    postsRef,
    where("isDeleted", "==", false),
    orderBy("publishedAt", "desc")
  );

  const querySnapshot = await getDocs(postsQuery);
  const posts: Post[] = [];

  for (const postDoc of querySnapshot.docs) {
    const data = postDoc.data();

    let subredditData = {
      id: "",
      title: "",
      slug: "",
    };

    if (data.subreddit?.id) {
      const subredditDocRef = doc(db, "subreddits", data.subreddit.id);
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

    posts.push({
      _id: postDoc.id,
      title: data.title,
      slug: data.slug,
      body: data.body,
      image: data.image ?? undefined,
      imageAlt: data.imageAlt ?? "",
      publishedAt: data.publishedAt,
      author: data.author,
      subreddit: subredditData,
      isDeleted: data.isDeleted,
    });
  }

  return posts;
}
