import type { LikeState } from "@petcircle/contracts";
import { useApiMutation } from "../../shared/api/mutation/useMutation";
import { useEffect, useRef, useState } from "react";
import type { LikeButtonProps } from "./like.types";
import { useDebounce } from "../../shared/hooks/useDebounce";

const DEBOUNCE_MS = 400;

export const useCreateLike = (postId: string) => {
    return useApiMutation<LikeState, void>('POST', `/posts/${postId}/like`);
};

export const useDeleteLike = (postId: string) => {
    return useApiMutation<LikeState, void>('DELETE', `/posts/${postId}/like`);
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

            if (result.ok && result.data !== undefined) {
                confirmed.current = { liked: result.data.liked, count: result.data.likeCount };
                setLiked(result.data.liked);
                setCount(result.data.likeCount);
                return;
            }

            // Echec : on revient a l'etat confirme et on le dit.
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
