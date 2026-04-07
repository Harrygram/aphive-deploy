import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getJoinedSubreddits } from "@/app/subreddit/joinedSubreddit";

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

export async function getPostsFromJoinedCommunities(userId: string): Promise<Post[]> {
  const joinedCommunities = await getJoinedSubreddits(userId);
  const joinedIds = joinedCommunities.map((sub) => sub._id);

  if (joinedIds.length === 0) return [];

  const postsRef = collection(db, "posts");
  const posts: Post[] = [];

  const batchSize = 10;
  for (let i = 0; i < joinedIds.length; i += batchSize) {
    const batchIds = joinedIds.slice(i, i + batchSize);
    const postsQuery = query(
      postsRef,
      where("subreddit.id", "in", batchIds),
      where("isDeleted", "==", false),
      orderBy("publishedAt", "desc")
    );

    const querySnapshot = await getDocs(postsQuery);
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
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
