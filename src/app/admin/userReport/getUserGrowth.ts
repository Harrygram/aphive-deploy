import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface MonthlyUserCount {
  month: string
  users: number
}

export async function getUserGrowthData(): Promise<MonthlyUserCount[]> {
  const usersRef = collection(db, "users")
  const snapshot = await getDocs(usersRef)

  const monthlyCounts: Record<string, number> = {}

  snapshot.forEach((doc) => {
    const data = doc.data()
    const rawDate = data.joinedAt

    let joinedAt: Date | null = null

    // Handle Firestore Timestamp or string ISO date
    if (rawDate?.toDate) {
      joinedAt = rawDate.toDate()
    } else if (typeof rawDate === "string") {
      joinedAt = new Date(rawDate)
    }

    if (!joinedAt || isNaN(joinedAt.getTime())) return

    const monthKey = joinedAt.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
  })

  return Object.entries(monthlyCounts)
    .map(([month, users]) => ({ month, users }))
    .sort(
      (a, b) =>
        new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    )
}
