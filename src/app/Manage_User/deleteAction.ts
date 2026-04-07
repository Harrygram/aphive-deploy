"use server";

import { deleteUser } from "@/app/Manage_User/deleteUser";

export async function deleteUserAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  if (!userId) return;

  await deleteUser(userId);
}
