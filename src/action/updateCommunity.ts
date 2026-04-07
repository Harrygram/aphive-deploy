import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updateCommunity(
  communityId: string,
  updates: {
    title: string;
    description?: string;
    image?: {
      base64: string;
      filename: string;
      contentType: string;
    } | null;
  }
) {
  try {
    const ref = doc(db, "subreddits", communityId);

    const updatePayload: any = {
      title: updates.title,
      description: updates.description || "",
    };

    if (updates.image === null) {
      updatePayload.image = null;
    } else if (updates.image) {
      updatePayload.image = {
        base64: updates.image.base64,
        filename: updates.image.filename,
        contentType: updates.image.contentType,
      };
    }

    await updateDoc(ref, updatePayload);
    return { success: true };
  } catch (error) {
    console.error("Error updating community:", error);
    return { error: "Failed to update community" };
  }
}
