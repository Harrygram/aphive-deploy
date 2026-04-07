// components/post/PostsList.tsx
import { getPosts } from "@/app/posts/getallPosts";
import { currentUser } from "@clerk/nextjs/server";
import PostWrapper from "./adminPosts";

export default async function PostsList() {
  const user = await currentUser();
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostWrapper key={post._id} post={post} userId={user?.id || null} />
      ))}
    </div>
  );
}








