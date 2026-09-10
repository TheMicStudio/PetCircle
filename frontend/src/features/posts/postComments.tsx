import { useState } from 'react';
import { Button } from '../../shared/components/Button';
import { useAddComment, useGetComments } from './useComments';
import { createCommentSchema, type PostComment } from '@petcircle/contracts';
import type { FieldErrors } from '../../shared/api/mutation/mutation';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { toFieldErrors } from '../../shared/validation';
import { DeleteButton } from '../../shared/components/DeleteButton';
import { useSession } from '../auth/session';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
});

export function PostComments({
    postId,
    onCommentAdded,
    onCommentDeleted,
}: {
    postId: string;
    onCommentAdded?: () => void;
    onCommentDeleted?: () => void;
}) {
    const [text, setText] = useState<string>('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [charactersLeft, setCharactersLeft] = useState<number>(300);
    const [added, setAdded] = useState<PostComment[]>([]);
    const [deleted, setDeleted] = useState<string[]>([]);
    const { user } = useSession();

    const comments = useGetComments(postId);

    const addComment = useAddComment(postId);

    const items = (comments.status === 'success' ? [...comments.data.items, ...added] : added).filter(
        (comment) => !deleted.includes(comment.id),
    );

    const isEmpty =
        comments.status === 'empty' ||
        (comments.status === 'success' && items.length === 0);

    const handleSubmit = async () => {
        const parsed = createCommentSchema.safeParse({ content: text });

        if (!parsed.success) {
            setErrors(toFieldErrors(parsed.error));
            return;
        }

        setErrors({});

        const result = await addComment.mutate({ content: text });

        const created = result.ok ? result.data : undefined;

        if (created !== undefined) {
            setAdded((previous) => [...previous, created]);
            setText('');
            onCommentAdded?.();
        }


    };

    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-5 shadow-[0_2px_4px_#0000000d,0_4px_8px_#0000001a]">
                <label className="text-[0.875rem] font-medium text-[#111111]" htmlFor="comment">
                    Écrire un commentaire
                </label>

                <textarea
                    className="mt-2 w-full resize-none rounded-[0.625rem] border border-solid border-[#d4d4d4] bg-white px-3 py-2 text-[0.875rem] text-[#111111] transition-[border-color,box-shadow] outline-none placeholder:text-[#9e9e9e] hover:border-[#a3a3a3] focus:border-[#262626] focus:shadow-[0_0_0_3px_#26262614]"
                    id="comment"
                    maxLength={300}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setCharactersLeft(300 - e.target.value.length);
                    }}
                    placeholder="Dis quelque chose de gentil..."
                    rows={3}
                />

                <ErrorMessages errors={errors} />

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.75rem] text-[#9e9e9e]">{charactersLeft} caractères maximum</span>
                    <Button onClick={handleSubmit}>Publier</Button>
                </div>
            </div>

            {comments.status === 'loading' && (
                <p className="text-[0.875rem] text-[#525252]">Chargement des commentaires...</p>
            )}

            {comments.status === 'error' && (
                <p className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]">
                    {comments.message}
                </p>
            )}

            {isEmpty && (
                <p className="text-[0.875rem] text-[#525252]">
                    Aucun commentaire pour le moment.
                </p>
            )}

            {comments.status === 'success' && items.length > 0 && (
                <ul className="flex flex-col gap-3">
                    {items.map((comment) => (
                        <li
                            className="flex gap-3 rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-4"
                            key={comment.id}
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1] text-[0.75rem] font-semibold text-[#525252]">
                                {comment.author.username.slice(0, 1).toUpperCase()}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[0.8125rem] font-medium text-[#111111]">
                                        {comment.author.username}
                                    </span>
                                    <time className="text-[0.6875rem] text-[#9e9e9e]" dateTime={comment.createdAt}>
                                        {dateFormatter.format(new Date(comment.createdAt))}
                                    </time>
                                </div>

                                <p className="text-[0.875rem] leading-relaxed whitespace-pre-wrap text-[#111111]">
                                    {comment.content}
                                </p>
                            </div>

                            {user !== null && user.id === comment.author.id && (
                                <DeleteButton
                                    label="Supprimer ce commentaire"
                                    onDeleted={() => {
                                        setDeleted((previous) => [...previous, comment.id]);
                                        onCommentDeleted?.();
                                    }}
                                    path={`/comments/${comment.id}`}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
