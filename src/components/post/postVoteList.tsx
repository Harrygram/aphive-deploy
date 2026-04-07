import { getPostVotes } from "@/app/vote/getPostVotes";
import { currentUser } from "@clerk/nextjs/server";
import PostWrapper from "./Post";
import type { Post } from "@/app/posts/getallPosts";

interface PostsListProps {
  posts: (Post & { voteCount: number })[];
}

export default async function PostsList({ posts }: PostsListProps) {
  const user = await currentUser();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostWrapper key={post._id} post={post} userId={user?.id || null} />
      ))}
    </div>
  );
}
