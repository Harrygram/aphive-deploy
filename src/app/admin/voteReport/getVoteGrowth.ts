import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface MonthlyVoteCount {
  month: string
  votes: number
}

export async function getVoteGrowthData(): Promise<MonthlyVoteCount[]> {
  const votesRef = collection(db, "votes")
  const snapshot = await getDocs(votesRef)

  const monthlyCounts: Record<string, number> = {}

  snapshot.forEach((doc) => {
    const data = doc.data()

    const rawDate = data.updatedAt ?? data.createdAt

    let voteDate: Date | null = null
    if (typeof rawDate?.toDate === "function") {
      voteDate = rawDate.toDate()
    } else if (typeof rawDate === "string") {
      voteDate = new Date(rawDate)
    }

    if (!voteDate || isNaN(voteDate.getTime())) return

    const monthKey = voteDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
  })

  return Object.entries(monthlyCounts)
    .map(([month, votes]) => ({ month, votes }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    )
}
