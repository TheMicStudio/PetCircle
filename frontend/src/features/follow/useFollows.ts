import { followStateSchema } from "@petcircle/contracts";
import { useApiMutation } from "../../shared/api/mutation/useMutation";
import { useEffect, useRef, useState } from "react";
import type { UseFollowInput } from "./follow.types";
import { useDebounce } from "../../shared/hooks/useDebounce";

const DEBOUNCE_MS = 400;

// the body stays unknown here, followStateSchema checks it before we trust it
export const useCreateFollow = (userId: string) => {
    return useApiMutation<unknown, void>('POST', `/users/${userId}/follow`);
};

export const useDeleteFollow = (userId: string) => {
    return useApiMutation<unknown, void>('DELETE', `/users/${userId}/follow`);
};


// all the follow logic: optimistic state, debounce, rollback when the API fails
export function useFollow({ userId, followedByMe, followerCount }: UseFollowInput) {
    const [following, setFollowing] = useState(followedByMe);
    const [count, setCount] = useState(followerCount);
    const [error, setError] = useState<string | null>(null);

    const createFollow = useCreateFollow(userId);
    const deleteFollow = useDeleteFollow(userId);

    // last state confirmed by the server, the fallback if the call fails
    const confirmed = useRef({ following: followedByMe, count: followerCount });
    const debouncedFollowing = useDebounce(following, DEBOUNCE_MS);

    useEffect(() => {
        // true on mount, and after a full round trip: nothing to send
        if (debouncedFollowing === confirmed.current.following) {
            return;
        }

        async function send() {
            const result = debouncedFollowing
                ? await createFollow.mutate()
                : await deleteFollow.mutate();

            if (result.ok) {
                const parsed = followStateSchema.safeParse(result.data);

                if (parsed.success) {
                    // the count comes from the server, never from our own arithmetic
                    confirmed.current = {
                        following: parsed.data.following,
                        count: parsed.data.followerCount,
                    };
                    setFollowing(parsed.data.following);
                    setCount(parsed.data.followerCount);
                    return;
                }
            }

            // failed call or unexpected body: back to the last confirmed state
            setFollowing(confirmed.current.following);
            setCount(confirmed.current.count);
            setError(result.ok ? "Réponse inattendue du serveur" : result.error);
        }

        void send();
    }, [debouncedFollowing]);

    // immediate feedback, before any network call
    function toggle() {
        setFollowing(!following);
        setCount(following ? count - 1 : count + 1);
        setError(null);
    }

    return { following, count, error, toggle };
}
