import { useApiMutation } from "../../shared/api/mutation/useMutation";
import { useApiQuery } from "../../shared/api/query/useQuery";



export const useCreatePost = () => {
    return useApiMutation("POST", "/posts");
};


export const useGetPosts = () => {
    return useApiQuery("/posts");
};
