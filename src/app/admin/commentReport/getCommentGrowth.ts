import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface MonthlyCommentCount {
  month: string
  comments: number
}

export async function getCommentGrowthData(): Promise<MonthlyCommentCount[]> {
  const commentsRef = collection(db, "comments")
  const snapshot = await getDocs(commentsRef)

  const monthlyCounts: Record<string, number> = {}

  snapshot.forEach((doc) => {
    const data = doc.data()
    const rawDate = data.createdAt

    let createdAt: Date | null = null

    // Support Firestore Timestamp or ISO string
    if (rawDate?.toDate) {
      createdAt = rawDate.toDate()
    } else if (typeof rawDate === "string") {
      createdAt = new Date(rawDate)
    }

    if (!createdAt || isNaN(createdAt.getTime())) return

    const monthKey = createdAt.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
  })

  return Object.entries(monthlyCounts)
    .map(([month, comments]) => ({ month, comments }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    )
}
