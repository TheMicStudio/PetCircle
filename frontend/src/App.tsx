import { Route, Routes } from 'react-router-dom';
import { Button } from '@astryxdesign/core/Button';
import { useCreatePost, useGetPosts } from './features/posts/usePosts';
import { RegisterPage, LoginPage } from './features/auth/auth.tsx';

function HomePage() {

    const createPost = useCreatePost();

    const posts = useGetPosts();

    console.log(posts);

    return (
        <main className="page">
            <h1>PetCircle</h1>
            <p>Le setup est en place. Les pages arrivent avec les stories S1 à S8.</p>
            <Button onClick={() => createPost.mutate({ content: "" })} label="Astryx est branché" variant="primary" />

            {createPost.state.status === 'success' && <p>Post created successfully!</p>}
            {createPost.state.status === 'error' && <p>{createPost.state.message}</p>}
            <RegisterPage />
            <LoginPage />
        </main>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}
