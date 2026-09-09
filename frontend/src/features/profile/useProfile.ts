import { useApiQuery } from "../../shared/api/query/useQuery";
import type { QueryState } from "../../shared/api/query/useQuery";
import { parseProfile, profilePath } from "./profile.api";
import type { PublicUser } from "./profile.api";

export type ProfileState = Exclude<QueryState<PublicUser>, { status: "empty" }>;

// 'empty' only happens on an empty array, this route returns an object: drop it from the type
export const useGetProfile = (id: string): ProfileState => {
  const state = useApiQuery<unknown>(profilePath(id));

  if (state.status === "loading") {
    return state;
  }

  if (state.status === "error") {
    // httpStatus is copied on purpose, the page needs it to tell a 404 apart
    return {
      status: "error",
      httpStatus: state.httpStatus,
      message:
        state.httpStatus === 401
          ? "Ta session a expiré, reconnecte-toi."
          : "Impossible de charger ce profil pour le moment.",
    };
  }

  if (state.status === "empty") {
    return { status: "error", message: "Réponse inattendue du serveur." };
  }

  const profile = parseProfile(state.data);

  if (profile === null) {
    return { status: "error", message: "Réponse inattendue du serveur." };
  }

  return { status: "success", data: profile };
};
