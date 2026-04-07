import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define only the fields you want to return from this function
export interface FirestoreUser {
  _id: string;
  username: string;
  email: string;
  imageUrl: string;
  role: "user" | "admin";
  status: string;
}

export async function addUser({
  id,
  username,
  email,
  imageUrl,
}: {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
}): Promise<FirestoreUser> {
  const userRef = doc(db, "users", id);
  const existingUser = await getDoc(userRef);

  const isAdmin = email.toLowerCase().includes("edu");
  const role: "user" | "admin" = isAdmin ? "admin" : "user";

  if (!existingUser.exists()) {
    const userData = {
      username,
      email,
      imageUrl,
      joinedAt: new Date().toISOString(),
      role,
      status: "Active", // ✅ add default status
    };

    await setDoc(userRef, userData);
    console.log("✅ User created in Firestore");

    return {
      _id: id,
      username,
      email,
      imageUrl,
      role,
      status: "active", // ✅ return it too
    };
  } else {
    console.log("ℹ️ User already exists in Firestore");

    const data = existingUser.data();

    return {
      _id: id,
      username: data.username,
      email: data.email,
      imageUrl: data.imageUrl,
      role: data.role ?? "user",
      status: data.status ?? "active", // fallback to "active"
    };
  }
}
