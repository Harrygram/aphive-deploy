import { redirect } from 'next/navigation';
import { getUser } from '@/app/user/getUser';
import PostsList from '@/components/post/PostsList';
import { UserCheckClient } from "@/app/user/usercheckclient";

export default async function Page() {
  const user = await getUser();

  // ✅ If signed in
  if (!("error" in user)) {
    if (user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/home");
    }
  }
  

  // 🔓 If not signed in, show public all posts
  return (
    <>
      {/* 🔐 Show sign-out logic + toast for deleted/blocked users */}
      {user.error && <UserCheckClient error={user.error} />}

      <section className="bg-white dark:bg-black border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Home</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recent posts from all the communities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-black">
        <div className="mx-auto px-4 py-6">
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            <PostsList />
          </div>
        </div>
      </section>
    </>
  );
}
