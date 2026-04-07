import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

type UserResult = {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  joinedAt: Date | null;
  status: string;
  role: "user" | "admin";
};

export async function getAllUsers(): Promise<UserResult[]> {
  const ref = collection(db, "users");
  const q = query(ref, orderBy("joinedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const joinedAt =
      data.joinedAt?.toDate?.() ||
      (typeof data.joinedAt === "string" ? new Date(data.joinedAt) : null);

    return {
      id: doc.id,
      username: data.username || "Unknown",
      email: data.email || "",
      imageUrl: data.imageUrl || "",
      joinedAt,
      status: data.status || "active",
      role: data.role || "user",
    };
  });
}
