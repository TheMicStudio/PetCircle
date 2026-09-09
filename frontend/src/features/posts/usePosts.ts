import type { FeedPage, FeedPost } from '@petcircle/contracts';
import { useApiMutation } from '../../shared/api/mutation/useMutation';
import { useApiQuery } from '../../shared/api/query/useQuery';

export const useCreatePost = () => {
    return useApiMutation<FeedPost, FormData>('POST', '/posts');
};

export const useGetPosts = () => {
    return useApiQuery<FeedPage>('/posts');
};

export const useGetPost = (id: string | undefined) => {
    return useApiQuery<FeedPost>(`/posts/${id}`);
};
