"use server";

import { downvoteComment} from "@/app/vote/downvoteComment";
import {getUser} from "@/app/user/getUser";
import { downvotePost } from "@/app/vote/downvotePost";

export async function downvote(
    contentId: string,
    contentType: "post" | "comment" = "post"
) {
    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    }

    if (contentType === "comment") {
        const vote = await downvoteComment(contentId, user._id);
        return { vote };
    } else {
        const vote = await downvotePost(contentId, user._id);
        return { vote };
    }
}