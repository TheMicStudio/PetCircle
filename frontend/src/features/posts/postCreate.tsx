import { useState } from 'react';
import { useCreatePost } from './usePosts';
import { toFieldErrors } from '../../shared/validation';
import { createPostSchema, uploadImageSchema } from '@petcircle/contracts';
import type { FeedPost } from '@petcircle/contracts';
import { ErrorMessages } from '../../shared/components/ErrorMessages';
import { Avatar } from '../../shared/components/Avatar';
import { CameraIcon } from '../../shared/components/icons';
import { useSession } from '../auth/session';

export const PostCreatePage = ({ setAdded }: { setAdded: React.Dispatch<React.SetStateAction<FeedPost[]>> }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileInputKey, setFileInputKey] = useState(0);
  const { user } = useSession();
  const post = useCreatePost();
  const isLoading = post.state.status === 'loading';
  const isEmpty = content.trim() === '';

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
      setFileInputKey((key) => key + 1);
    }

  };


  return (
    <div className="rounded-[0.875rem] bg-pc-surface px-[1.125rem] py-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center gap-3">
          {user !== null && <Avatar username={user.username} />}
          <input
            type="text"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // typing a new post hides the previous success / error
              post.reset();
            }}
            disabled={isLoading}
            aria-label="Nouveau post"
            placeholder="Quoi de neuf ?"
            className="min-w-0 flex-1 rounded-[1.375rem] border-none bg-pc-sand px-4 py-3 font-body text-[0.9rem] text-pc-ink outline-none placeholder:text-pc-faint focus:shadow-[inset_0_0_0_1.5px_var(--color-pc-cta)]"
          />
        </div>

        <ErrorMessages errors={errors} />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Aperçu de l'image choisie"
            className="mt-3 h-40 w-40 self-start rounded-[0.625rem] bg-pc-photo object-cover"
          />
        )}

        {post.state.status === 'error' && (
          <p className="mt-3 rounded-[0.625rem] bg-pc-danger-bg px-3 py-2 text-[0.75rem] font-medium text-pc-danger" role="alert">
            {post.state.message}
          </p>
        )}

        {post.state.status === 'success' && (
          <p className="mt-3 rounded-[0.625rem] bg-pc-success-bg px-3 py-2 text-[0.75rem] font-medium text-pc-success" role="status">
            Post publié.
          </p>
        )}

        <div className="mt-3.5 -mx-[1.125rem] h-px bg-pc-hair" />

        <div className="mt-2.5 -mx-1.5 flex items-center gap-1">
          <label
            className={`flex items-center gap-2 rounded-[0.5625rem] px-3 py-2 text-[0.8125rem] font-semibold text-pc-body transition-colors hover:bg-pc-sand hover:text-pc-ink ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => setImage(e.target.files?.[0])}
              disabled={isLoading}
              className="sr-only"
            />
            <CameraIcon />
            Photo
          </label>
          {image && <span className="min-w-0 truncate text-[0.75rem] text-pc-muted2">{image.name}</span>}

          <button
            type="submit"
            className="ml-auto cursor-pointer rounded-[0.625rem] bg-pc-cta px-5 py-2.5 text-[0.8125rem] font-bold text-pc-ink transition-colors hover:bg-pc-cta2 disabled:cursor-not-allowed disabled:bg-pc-sand disabled:text-pc-faint"
            disabled={isLoading || isEmpty}
          >
            {isLoading ? "Publication…" : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
};
