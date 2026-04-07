import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function deleteCommunity(communityId: string) {
  try {
    const ref = doc(db, "subreddits", communityId);
    await updateDoc(ref, {
      isDeleted: true,
      title: "Deleted Community",
      description: "This community was removed by an admin.",
      image: null,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting community:", error);
    return { error: "Failed to delete community" };
  }
}
