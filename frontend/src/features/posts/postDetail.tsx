import { Link, useParams } from 'react-router-dom';
import { NotFound } from '../../shared/components/NotFound';
import { PostComments } from './postComments';
import { useGetPost } from './usePosts';
import { useState } from 'react';
import { LikeButton } from '../likes/likeButton';

const card =
    'overflow-hidden rounded-[0.75rem] border border-solid border-[#00000014] bg-white shadow-[0_2px_4px_#0000000d,0_4px_8px_#0000001a]';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function PostDetail() {
    const { id } = useParams();

    const post = useGetPost(id);

    const [extraComments, setExtraComments] = useState<number>(0);

    if (post.status === 'empty' || (post.status === 'error' && post.httpStatus === 404)) {
        return (
            <NotFound
                title="Post introuvable"
                message="Ce post a été supprimé ou n'a jamais existé."
            />
        );
    }

    const commentCount = (post.status === 'success' ? post.data.commentCount : 0) + extraComments;

    return (
        <div className="min-h-screen bg-[#f1f1f1] p-6 [color-scheme:light]">
            <div className="mx-auto flex w-full max-w-[36rem] flex-col gap-4">
                <Link
                    className="text-[0.875rem] font-medium text-[#525252] no-underline transition-colors hover:text-[#111111]"
                    to="/feed"
                >
                    ← Retour au fil
                </Link>

                {post.status === 'loading' && <div className={`${card} h-72 animate-pulse bg-[#e5e5e5]`} />}

                {post.status === 'error' && (
                    <p className="rounded-[0.625rem] bg-[#ffc4be] px-3 py-2 text-[0.75rem] font-medium text-[#9e0015]">
                        {post.message}
                    </p>
                )}

                {post.status === 'success' && (
                    <>
                        <article className={card}>
                            <header className="flex items-center gap-3 p-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f1f1] text-[0.875rem] font-semibold text-[#525252]">
                                    {post.data.author.username.slice(0, 1).toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-[0.875rem] font-medium text-[#111111]">
                                        {post.data.author.username}
                                    </p>
                                    <time className="text-[0.75rem] text-[#525252]" dateTime={post.data.createdAt}>
                                        {dateFormatter.format(new Date(post.data.createdAt))}
                                    </time>
                                </div>
                            </header>

                            <p className="px-5 pb-5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-[#111111]">
                                {post.data.content}
                            </p>

                            {post.data.imageUrl !== null && (
                                <img
                                    className="w-full border-t border-solid border-[#00000014]"
                                    src={post.data.imageUrl}
                                    alt=""
                                />
                            )}

                            <footer className="flex items-center gap-6 border-t border-solid border-[#00000014] px-5 py-4 text-[0.8125rem]">
                                    <LikeButton postId={post.data.id} likedByMe={post.data.likedByMe} likeCount={post.data.likeCount} />
                                <span className="text-[#525252]">
                                    {commentCount} commentaire{commentCount > 1 ? 's' : ''}
                                </span>
                            </footer>
                        </article>

                        <PostComments postId={post.data.id} onCommentAdded={() => setExtraComments((n) => n + 1)} />
                    </>
                )}
            </div>
        </div>
    );
}
