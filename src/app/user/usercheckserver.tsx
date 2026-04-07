import { getUser } from "@/app/user/getUser";
import { UserCheckClient } from "./usercheckclient";

export default async function UserCheckServer() {
  const user = await getUser();

  if ("error" in user) {
    return <UserCheckClient error={user.error} />;
  }

  return null;
}
