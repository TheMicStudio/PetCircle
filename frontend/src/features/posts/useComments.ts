import type { CommentPage, CreateCommentInput, PostComment } from '@petcircle/contracts';
import { useApiQuery } from '../../shared/api/query/useQuery';
import { useApiMutation } from '../../shared/api/mutation/useMutation';

export const useGetComments = (postId: string) => {
    return useApiQuery<CommentPage>(`/posts/${postId}/comments`);
};


export const useAddComment = (postId: string) => {
    return useApiMutation<PostComment, CreateCommentInput>("POST", `/posts/${postId}/comments`);
};
