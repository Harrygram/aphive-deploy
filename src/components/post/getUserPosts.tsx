import { currentUser } from "@clerk/nextjs/server";
import { getUserCreatedPosts } from "@/app/posts/getCreatedPosts";
import PostWrapper from "./Post";

export default async function PostsList() {
  const user = await currentUser();

  // If user is not logged in, return nothing or a message
  if (!user) {
    return <p className="text-center text-gray-500">Please log in to see your posts.</p>;
  }

  const posts = await getUserCreatedPosts(user.id);

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostWrapper key={post._id} post={post} userId={user.id} />
        ))
      ) : (
        <p className="text-center text-gray-500">You haven't created any posts yet.</p>
      )}
    </div>
  );
}
