import { useApiMutation } from '../../shared/api/mutation/useMutation';
import { useApiQuery } from '../../shared/api/query/useQuery';
import type { CreatePostInput, FeedPage, FeedPost } from './posts.type';

export const useCreatePost = () => {
    return useApiMutation<FeedPost, CreatePostInput>('POST', '/posts');
};

export const useGetPosts = () => {
    return useApiQuery<FeedPage>('/posts');
};
