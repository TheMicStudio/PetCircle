import { useApiMutation } from '../../shared/api/mutation/useMutation';
import { useApiQuery } from '../../shared/api/query/useQuery';
import type { FeedPage, FeedPost } from "@petcircle/contracts";

export const useCreatePost = () => {
    return useApiMutation<FeedPost, FormData>('POST', '/posts');
};

export const useGetPosts = () => {
    return useApiQuery<FeedPage>('/posts');
};
