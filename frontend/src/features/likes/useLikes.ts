import { likeStateSchema } from "@petcircle/contracts";
import { useApiMutation } from "../../shared/api/mutation/useMutation";
import { useEffect, useRef, useState } from "react";
import type { LikeButtonProps } from "./like.types";
import { useDebounce } from "../../shared/hooks/useDebounce";

const DEBOUNCE_MS = 400;

// the body stays unknown here, likeStateSchema checks it before we trust it
export const useCreateLike = (postId: string) => {
    return useApiMutation<unknown, void>('POST', `/posts/${postId}/like`);
};

export const useDeleteLike = (postId: string) => {
    return useApiMutation<unknown, void>('DELETE', `/posts/${postId}/like`);
};


// Toute la logique du like : affichage optimiste, debounce, retour arriere.
export function useLike({ postId, likedByMe, likeCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(likedByMe);
    const [count, setCount] = useState(likeCount);
    const [error, setError] = useState<string | null>(null);

    const createLike = useCreateLike(postId);
    const deleteLike = useDeleteLike(postId);

    // Dernier etat confirme par le serveur : le point de retour si l'API echoue.
    const confirmed = useRef({ liked: likedByMe, count: likeCount });
    const debouncedLiked = useDebounce(liked, DEBOUNCE_MS);

    useEffect(() => {
        // Vrai au montage, et apres un aller-retour complet : rien a envoyer.
        if (debouncedLiked === confirmed.current.liked) {
            return;
        }

        async function send() {
            const result = debouncedLiked
                ? await createLike.mutate()
                : await deleteLike.mutate();

            if (result.ok) {
                const parsed = likeStateSchema.safeParse(result.data);

                if (parsed.success) {
                    // the count comes from the server, never from our own arithmetic
                    confirmed.current = { liked: parsed.data.liked, count: parsed.data.likeCount };
                    setLiked(parsed.data.liked);
                    setCount(parsed.data.likeCount);
                    return;
                }
            }

            // failed call or unexpected body: back to the last confirmed state
            setLiked(confirmed.current.liked);
            setCount(confirmed.current.count);
            setError(result.ok ? "Réponse inattendue du serveur" : result.error);
        }

        void send();
    }, [debouncedLiked]);

    // Reaction immediate, avant tout appel reseau.
    function toggle(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
        setError(null);
    }

    return { liked, count, error, toggle };
}
