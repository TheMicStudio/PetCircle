import type { LoginInput, RegisterInput, SessionUser } from "@petcircle/contracts";
import { useApiMutation } from "../../shared/api/mutation/useMutation";

export const useLogin = () => {
  return useApiMutation<SessionUser, LoginInput>("POST", "/auth/login")
};

export const useRegister = () => {
  return useApiMutation<SessionUser, RegisterInput>("POST", "/auth/register")
};
