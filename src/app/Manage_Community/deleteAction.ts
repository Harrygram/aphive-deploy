"use server";

import { deleteCommunity } from "@/app/Manage_Community/deleteCommunity";

export async function deleteCommunityAction(formData: FormData) {
  const communityId = formData.get("communityId") as string;
  if (!communityId) return;

  await deleteCommunity(communityId);
}
