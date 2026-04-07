import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { currentUser } from "@clerk/nextjs/server";
import { addUser } from "./addUser";

type UserResult = {
  name: string;
  _id: string;
  username: string;
  imageUrl: string;
  email: string;
  role: "user" | "admin";
  status: string;
};

const parseUsername = (username: string) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return username
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/\s+/g, "") + randomNum;
};

export async function getUser(): Promise<UserResult | { error: string }> {
  try {
    console.log("Getting current user from Clerk");
    const loggedInUser = await currentUser();

    if (!loggedInUser) {
      console.log("No user is currently signed in");
      return { error: "Not signed in" };
    }

    console.log(`Found Clerk user: ${loggedInUser.id}`);

    const userRef = doc(db, "users", loggedInUser.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log(`User found in Firestore with ID: ${userSnap.id}`);
      const data = userSnap.data();

      // ✅ Block access if status is not active
      if (data.status && data.status == "deleted") {
        console.warn(`Blocked user: ${data.email} (status: ${data.status})`);
        return { error: "Your account has been disabled or deleted." };
      }

      return {
        name: data.username,
        _id: userSnap.id,
        username: data.username,
        imageUrl: data.imageUrl,
        email: data.email,
        role: data.role ?? "user",
        status: data.status ?? "active",
      };
    }

    // ➕ User not found, create new
    console.log("User not found in Firestore, creating new user");
    const newUser = await addUser({
      id: loggedInUser.id,
      username: parseUsername(loggedInUser.fullName!),
      email:
        loggedInUser.primaryEmailAddress?.emailAddress ||
        loggedInUser.emailAddresses[0].emailAddress,
      imageUrl: loggedInUser.imageUrl,
    });

    console.log(`New user created with ID: ${newUser._id}`);
    return {
      name: newUser.username,
      _id: newUser._id,
      username: newUser.username,
      imageUrl: newUser.imageUrl,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return { error: "Failed to get user" };
  }
}
