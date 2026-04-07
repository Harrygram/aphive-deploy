import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Soft-delete a user by updating their status and clearing personal info.
 * Assumes 'users' collection contains: email, imageUrl, joinedAt, status, username
 */
export async function deleteUser(userId: string) {
  try {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, {
      status: "deleted",
      username: "Deleted User",
      imageUrl: "",
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
}
