import { useState } from 'react';
import { useCreatePost } from './usePosts';
import { toFieldErrors } from '../../shared/validation';
import { createPostSchema, uploadImageSchema } from '@petcircle/contracts';
import type { FeedPost } from '@petcircle/contracts';
import { ErrorMessages } from '../../shared/components/ErrorMessages';

export const PostCreatePage = ({ setAdded }: { setAdded: React.Dispatch<React.SetStateAction<FeedPost[]>> }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const post = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createPostSchema.safeParse({ content: content });
    const uploadImage = image ? uploadImageSchema.safeParse({ image }) : undefined;

    if (!parsed.success) {
        setErrors(toFieldErrors(parsed.error));
        return;
    }

    if (uploadImage && !uploadImage.success) {
        setErrors(toFieldErrors(uploadImage.error));
        return;
    }

    const formData = new FormData();

    formData.append('content', content);
      if (image) formData.append('image', image);


    setErrors({});

    const result = await post.mutate(formData);

    const created = result.ok ? result.data : undefined;

    if (created !== undefined) {
      setAdded((previous) => [created, ...previous]);
      setContent('');
      setImage(undefined);
    }

  };


  return (
    <div className="rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-4 shadow-[0_1px_2px_#0000000d]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quoi de neuf ?"
          className="w-full rounded-[0.5rem] border border-solid border-[#00000014] px-3 py-2 text-[0.875rem] text-[#111111] outline-none placeholder:text-[#9e9e9e] focus:border-[#525252]"
        />
        <ErrorMessages errors={errors} />

        <div className="flex gap-2">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0])}
            className="text-[0.75rem] text-[#525252] file:mr-3 file:cursor-pointer file:rounded-[0.375rem] file:border-0 file:bg-[#f5f5f5] file:px-3 file:py-1.5 file:text-[0.75rem] file:text-[#111111] hover:file:bg-[#ebebeb]"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview image"
              className="h-48 w-48 self-start rounded-[0.5rem] border border-solid border-[#00000014] object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="self-end cursor-pointer rounded-[0.5rem] bg-[#111111] px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-[#333333]"
          disabled={post.state.status === "loading"}
        >{post.state.status === "loading" ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};
