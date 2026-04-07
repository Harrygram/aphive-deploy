import { currentUser } from "@clerk/nextjs/server";
import { getPostsFromJoinedCommunities } from "@/app/posts/getJoinedPosts"; 
import PostWrapper from "./Post";

export default async function PostsList() {
  const user = await currentUser();

  // If user is not logged in, return nothing or a message
  if (!user) {
    return <p className="text-center text-gray-500">Please log in to see your feed.</p>;
  }

  const posts = await getPostsFromJoinedCommunities(user.id);

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostWrapper key={post._id} post={post} userId={user.id} />
        ))
      ) : (
        <p className="text-center text-gray-500">
          No posts from your communities yet / You haven't joined any communities yet.
        </p>
      )}
    </div>
  );
}
