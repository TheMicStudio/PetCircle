import { useApiQuery } from "../../shared/api/query/useQuery";

export const useGetProfile = () => {
  return useApiQuery("/users")
};
