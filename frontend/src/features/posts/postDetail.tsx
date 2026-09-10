import { Link, useParams } from 'react-router-dom';
import { NotFound } from '../../shared/components/NotFound';
import { PostComments } from './postComments';
import { useGetPost } from './usePosts';
import { useState } from 'react';
import { LikeButton } from '../likes/likeButton';
import { AppHeader } from '../../shared/components/AppHeader';
import { Avatar } from '../../shared/components/Avatar';
import { BackIcon, BarkIcon } from '../../shared/components/icons';
import { formatRelativeDate } from '../../shared/formatDate';

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
    const hasImage = post.status === 'success' && post.data.imageUrl !== null;

    return (
        <div className="pc-app">
            <AppHeader
                leading={
                    <Link
                        className="flex items-center gap-2 rounded-[0.625rem] bg-pc-sand py-2.5 pr-3.5 pl-2.5 text-[0.8125rem] font-semibold text-pc-ink no-underline transition-colors hover:bg-pc-hover2"
                        to="/feed"
                    >
                        <BackIcon />
                        <span className="hidden sm:inline">Retour au fil</span>
                    </Link>
                }
            />

            <div className="mx-auto flex max-w-[70rem] flex-col gap-[clamp(0.875rem,2.2vw,1.625rem)] px-4 pt-3.5 pb-16 sm:px-[clamp(1rem,3vw,2.125rem)] sm:pt-[clamp(0.875rem,2vw,1.625rem)] md:flex-row md:items-stretch">
                {post.status === 'loading' && (
                    <div className="mx-auto h-72 w-full max-w-[40rem] animate-pulse rounded-[0.875rem] bg-pc-surface" />
                )}

                {post.status === 'error' && (
                    <p className="mx-auto w-full max-w-[40rem] rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger" role="alert">
                        {post.message}
                    </p>
                )}

                {post.status === 'success' && (
                    <>
                        {/* the image keeps a fixed ratio on mobile, and stretches to the card height beside it on desktop */}
                        {post.data.imageUrl !== null && (
                            <div className="aspect-[4/3] flex-1 overflow-hidden rounded-[0.875rem] bg-pc-photo md:aspect-auto md:min-h-[21.25rem]">
                                <img alt="" className="h-full w-full object-cover" src={post.data.imageUrl} />
                            </div>
                        )}

                        <article
                            className={`flex min-w-0 flex-col rounded-[0.875rem] bg-pc-surface ${hasImage ? 'flex-[1_1_23.75rem]' : 'mx-auto w-full max-w-[40rem]'}`}
                        >
                            <header className="flex items-center gap-3 px-5 pt-[1.125rem] pb-3.5">
                                <Avatar username={post.data.author.username} />

                                <div className="min-w-0 flex-1">
                                    <Link
                                        className="text-[1rem] font-bold text-pc-ink no-underline hover:underline hover:underline-offset-2"
                                        to={`/profile/${post.data.author.id}`}
                                    >
                                        {post.data.author.username}
                                    </Link>
                                    <div className="mt-1 text-[0.75rem] text-pc-muted2">
                                        <time dateTime={post.data.createdAt} title={dateFormatter.format(new Date(post.data.createdAt))}>
                                            {formatRelativeDate(post.data.createdAt)}
                                        </time>
                                    </div>
                                </div>
                            </header>

                            <p className="px-5 pb-4 text-[0.96875rem] leading-[1.6] whitespace-pre-wrap text-pc-ink2">
                                {post.data.content}
                            </p>

                            <div className="h-px bg-pc-hair" />

                            <div className="flex items-center gap-0.5 px-3.5 py-1.5">
                                <LikeButton postId={post.data.id} likedByMe={post.data.likedByMe} likeCount={post.data.likeCount} />
                                <span className="flex flex-1 items-center justify-center gap-2 px-2 py-2.5 text-[0.8125rem] font-semibold text-pc-body">
                                    <BarkIcon />
                                    {commentCount} commentaire{commentCount > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="h-px bg-pc-hair" />

                            <PostComments postId={post.data.id} onCommentAdded={() => setExtraComments((n) => n + 1)} />
                        </article>
                    </>
                )}
            </div>
        </div>
    );
}
