import { useApiMutation } from "../../shared/api/mutation/useMutation";
import { useApiQuery } from "../../shared/api/query/useQuery";

export const useLogin = () => {
  return useApiMutation("POST", "/auth/login")
};

export const useRegister = () => {
  return useApiMutation("POST", "/auth/register")
};

export const useGetMe = () => {
  return useApiQuery("/users/me")
};
