import { useEffect, useState } from "react";
import type { PostAuthor, PublicUser } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";
import { parseProfile, profilePath } from "../profile/profile.api";

// Loads the public profile of each candidate author and keeps the ones I do not follow yet.
// One hook for the whole list, so the rail knows whether it has anything to show.
export function useFollowSuggestions(authors: PostAuthor[], limit: number): PublicUser[] {
  const [profiles, setProfiles] = useState<Record<string, PublicUser>>({});
  const ids = authors.map((author) => author.id);
  const key = ids.join(",");

  useEffect(() => {
    const controller = new AbortController();
    // only the ids not fetched yet, the feed grows page after page
    const missing = ids.filter((id) => profiles[id] === undefined);

    if (missing.length === 0) {
      return;
    }

    void Promise.all(
      missing.map(async (id) => {
        const result = await apiGet<unknown>(profilePath(id), controller.signal);
        return result.ok ? parseProfile(result.data) : null;
      }),
    )
      .then((loaded) => {
        if (controller.signal.aborted) return;

        setProfiles((previous) => {
          const next = { ...previous };
          for (const profile of loaded) {
            if (profile !== null) next[profile.id] = profile;
          }
          return next;
        });
      })
      // a failed suggestion is not worth an error message, the row simply never shows
      .catch(() => undefined);

    return () => controller.abort();
    // key stands for ids, and profiles is read on purpose without retriggering the effect
  }, [key]);

  return ids
    .map((id) => profiles[id])
    .filter((profile): profile is PublicUser => profile !== undefined && !profile.followedByMe)
    .slice(0, limit);
}
