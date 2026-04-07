"use server";
import { getUser } from "@/app/user/getUser";
import { upvoteComment } from "@/app/vote/upvoteComment";
import { upvotePost } from "@/app/vote/upvotePost";

export async function upvote(
    contentId : string,
    contentType: "post" | "comment" = "post"    

) {

    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    }   

    if (contentType === "comment") {
        const vote = await upvoteComment(contentId, user._id);        
        return { vote};

    } else {
        const vote = await upvotePost(contentId, user._id);        
        return { vote };
    }

  


}