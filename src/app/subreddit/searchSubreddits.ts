import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function searchSubreddits(searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === "") return [];

  const snapshot = await getDocs(collection(db, "subreddits"));
  const lowerSearchTerm = searchTerm.toLowerCase();

  const results = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((sub: any) =>
      sub.title.toLowerCase().includes(lowerSearchTerm)
    );

  return results;
}
