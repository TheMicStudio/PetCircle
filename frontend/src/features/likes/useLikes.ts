import type { LikeState } from "@petcircle/contracts";
import { useApiMutation } from "../../shared/api/mutation/useMutation";


export const useCreateLike = () => {
    return useApiMutation<LikeState, undefined>('POST', '/posts/${postId}/like');
}; 

export const useDeleteLike = () => {
    return useApiMutation<LikeState, undefined>('DELETE', '/posts/${postId}/like');
}