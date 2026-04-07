'use server';

import { getUser } from "@/app/user/getUser";
import { addComment } from "@/app/comment/addComment";

export async function createComment(
    postId: string,
    content: string,
    parentCommentId?: string 
) {
    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    } 
    
    try {
        const comment = await addComment({
            postId,
            userId: user._id,
            content,    
            parentCommentId
        });

    return comment;
    } catch (error) {
    console.error("Error fetching user:", error);
        return { error: "Failed to fetch user" };
    }
    
}