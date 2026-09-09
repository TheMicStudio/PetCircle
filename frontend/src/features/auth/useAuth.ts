import { useApiMutation } from "../../shared/api/mutation/useMutation";

export const useLogin = () => {
  return useApiMutation("POST", "/auth/login")
};

export const useRegister = () => {
  return useApiMutation("POST", "/auth/register")
};
