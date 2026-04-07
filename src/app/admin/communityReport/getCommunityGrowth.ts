import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface MonthlyCommunityCount {
  month: string
  communities: number
}

export async function getCommunityGrowthData(): Promise<MonthlyCommunityCount[]> {
  const communitiesRef = collection(db, "subreddits")
  const snapshot = await getDocs(communitiesRef)

  const monthlyCounts: Record<string, number> = {}

  snapshot.forEach((doc) => {
    const data = doc.data()
    const rawDate = data.createdAt

    let createdAt: Date | null = null

    // Handle Firestore Timestamp or string ISO date
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
    .map(([month, communities]) => ({ month, communities }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    )
}
