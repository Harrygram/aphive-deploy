import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface MonthlyPostCount {
  month: string;
  posts: number;
}

export async function getPostGrowthData(): Promise<MonthlyPostCount[]> {
  const postsRef = collection(db, "posts");
  const snapshot = await getDocs(postsRef);

  const monthlyCounts: Record<string, number> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const publishedAt = data.publishedAt?.toDate?.();

    if (!publishedAt) return;

    const monthKey = publishedAt.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyCounts)
    .map(([month, posts]) => ({ month, posts }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    );
}
