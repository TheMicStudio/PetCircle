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
  );
};
