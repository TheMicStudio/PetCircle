import { useApiQuery } from "../../shared/api/query/useQuery";
import type { QueryState } from "../../shared/api/query/useQuery";
import { parseProfile, profilePath } from "./profile.api";
import type { PublicUser } from "./profile.api";

export const useGetProfile = (id: string): QueryState<PublicUser> => {
  const state = useApiQuery<unknown>(profilePath(id));

  if (state.status !== "success") {
    return state;
  }

  const profile = parseProfile(state.data);

  if (profile === null) {
    return { status: "error", message: "Réponse inattendue du serveur." };
  }

  return { status: "success", data: profile };
};
