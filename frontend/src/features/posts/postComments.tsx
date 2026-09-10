import { useState } from 'react';
import { useAddComment, useGetComments } from './useComments';
import { createCommentSchema, type PostComment } from '@petcircle/contracts';
import type { FieldErrors } from '../../shared/api/mutation/mutation';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { toFieldErrors } from '../../shared/validation';
import { Avatar } from '../../shared/components/Avatar';
import { formatRelativeDate } from '../../shared/formatDate';
import { useSession } from '../auth/session';

const MAX_LENGTH = 300;

// Rendered inside the post card: the list scrolls, the form stays pinned at the bottom.
export function PostComments({ postId, onCommentAdded }: { postId: string; onCommentAdded?: () => void }) {
    const [text, setText] = useState<string>('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [added, setAdded] = useState<PostComment[]>([]);
    const { user } = useSession();

    const comments = useGetComments(postId);

    const addComment = useAddComment(postId);
    const sending = addComment.state.status === 'loading';

    const items = comments.status === 'success' ? [...comments.data.items, ...added] : added;

    const isEmpty =
        comments.status === 'empty' ||
        (comments.status === 'success' && items.length === 0);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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
        <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex max-h-[min(32.5rem,54vh)] flex-col gap-4 overflow-y-auto px-5 py-4 [scrollbar-color:var(--color-pc-dot)_transparent] [scrollbar-width:thin]">
                {comments.status === 'loading' && (
                    <p className="text-[0.875rem] text-pc-muted">Chargement des commentaires…</p>
                )}

                {comments.status === 'error' && (
                    <p className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger" role="alert">
                        {comments.message}
                    </p>
                )}

                {isEmpty && (
                    <p className="text-[0.875rem] text-pc-muted">Aucun commentaire pour le moment. Lance le premier aboiement.</p>
                )}

                {items.length > 0 && (
                    <ul className="flex flex-col gap-4">
                        {items.map((comment) => (
                            <li className="flex items-start gap-3" key={comment.id}>
                                <Avatar size="sm" username={comment.author.username} />

                                <div className="min-w-0 flex-1">
                                    <div className="rounded-[0.25rem_0.875rem_0.875rem_0.875rem] bg-pc-surface2 px-3.5 py-2.5">
                                        <span className="text-[0.8125rem] font-bold text-pc-ink">{comment.author.username}</span>
                                        <p className="mt-1 text-[0.84375rem] leading-[1.5] whitespace-pre-wrap text-pc-body">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <time
                                        className="mt-1.5 ml-1 block text-[0.71875rem] font-medium text-pc-muted2"
                                        dateTime={comment.createdAt}
                                    >
                                        {formatRelativeDate(comment.createdAt)}
                                    </time>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="h-px bg-pc-hair" />

            <form className="px-5 pt-3.5 pb-4" onSubmit={(event) => void handleSubmit(event)}>
                <div className="flex items-center gap-3">
                    {user !== null && <Avatar size="sm" username={user.username} />}
                    <input
                        aria-label="Écrire un commentaire"
                        className="min-w-0 flex-1 rounded-[1.125rem] border-none bg-pc-sand px-4 py-3 font-body text-[0.84375rem] text-pc-ink outline-none placeholder:text-pc-faint focus:shadow-[inset_0_0_0_1.5px_var(--color-pc-cta)]"
                        disabled={sending}
                        maxLength={MAX_LENGTH}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Ajouter un commentaire…"
                        value={text}
                    />
                    <button
                        className="shrink-0 cursor-pointer rounded-[0.625rem] bg-pc-cta px-4 py-3 text-[0.78125rem] font-bold text-pc-ink transition-colors hover:bg-pc-cta2 disabled:cursor-not-allowed disabled:bg-pc-sand disabled:text-pc-faint"
                        disabled={sending || text.trim() === ''}
                        type="submit"
                    >
                        Envoyer
                    </button>
                </div>

                <ErrorMessages errors={errors} />

                {addComment.state.status === 'error' && (
                    <p className="mt-2 text-[0.75rem] font-medium text-pc-danger" role="alert">
                        {addComment.state.message}
                    </p>
                )}

                <p className="mt-2 text-[0.71875rem] text-pc-muted2">{MAX_LENGTH - text.length} caractères restants</p>
            </form>
        </section>
    );
}
