<<<<<<< HEAD

import { useCreatePost } from './usePosts';
import { useState } from 'react';


export const PostCreatePage = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);

  const post = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
      if (image) formData.append('image', image);

    post.mutate(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files?.[0])} />
        <button type="submit">Create Post</button>
      </form>
    </div>
=======
import type { FeedPost } from "./posts.type";

export const PostList = ({ items }: { items: FeedPost[] }) => {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((post) => (
        <li
          key={post.id}
          className="rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-4 shadow-[0_1px_2px_#0000000d]"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[0.875rem] font-medium text-[#111111]">{post.author.username}</span>
            <span className="text-[0.75rem] text-[#9e9e9e]">
              {new Date(post.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>

          <p className="mt-2 text-[0.875rem] whitespace-pre-wrap text-[#111111]">{post.content}</p>

          {post.imageUrl !== null && (
            <img className="mt-3 w-full rounded-[0.5rem]" src={post.imageUrl} />
          )}

          <div className="mt-3 flex gap-4 text-[0.75rem] text-[#525252]">
            <span>{post.likeCount} j'aime</span>
            <span>{post.commentCount} commentaires</span>
          </div>
        </li>
      ))}
    </ul>
>>>>>>> feature/sign-up
  );
};
