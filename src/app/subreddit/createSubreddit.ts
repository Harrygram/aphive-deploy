import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { Subreddit } from "./getSubreddits";

interface ImageData {
  base64: string;
  filename: string;
  contentType: string;
}

export async function createSubreddit(
  name: string,
  moderatorId: string, // Clerk User ID from getUser()
  imageData: ImageData | null,
  customSlug?: string,
  customDescription?: string
): Promise<{ subreddit?: Subreddit; error?: string }> {
  try {
    const subredditsRef = collection(db, "subreddits");

    // 🔍 Check for duplicate title
    const nameQuery = query(subredditsRef, where("title", "==", name));
    const nameSnapshot = await getDocs(nameQuery);
    if (!nameSnapshot.empty) {
      console.warn(`Subreddit "${name}" already exists`);
      return { error: "A subreddit with this name already exists" };
    }

    // 🔍 Check for duplicate slug
    const slug = (customSlug || name.toLowerCase().replace(/\s+/g, "-")).trim();
    const slugQuery = query(subredditsRef, where("slug", "==", slug));
    const slugSnapshot = await getDocs(slugQuery);
    if (!slugSnapshot.empty) {
      console.warn(`Subreddit with slug "${slug}" already exists`);
      return { error: "A subreddit with this URL already exists" };
    }

    // 🖼️ Optional image
    const image = imageData
      ? {
          base64: imageData.base64,
          filename: imageData.filename,
          contentType: imageData.contentType,
        }
      : undefined;

    // 📄 Subreddit document
    const subredditDoc: Omit<Subreddit, "_id"> = {
      title: name,
      slug,
      description: customDescription || `Welcome to r/${name}!`,
      moderatorId: moderatorId,
      createdAt: Timestamp.now().toDate().toISOString(),
      num_followers: 1,
      ...(image && { image }),
    };

    // ➕ Add subreddit to Firestore
    const docRef = await addDoc(subredditsRef, subredditDoc);

    // 👥 Auto-follow: creator follows their own community
    const followDocId = `${moderatorId}_${docRef.id}`;
    const followRef = doc(db, "follows", followDocId);

    await setDoc(followRef, {
      userId: moderatorId,
      communityId: docRef.id,
      followedAt: new Date().toISOString(),
    });

    return {
      subreddit: {
        ...subredditDoc,
        _id: docRef.id,
      },
    };
  } catch (error) {
    console.error("❌ Error creating subreddit:", error);
    return { error: "Failed to create subreddit" };
  }
}
