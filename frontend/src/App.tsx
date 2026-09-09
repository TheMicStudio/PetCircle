import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './features/auth/auth.tsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { Feed } from './features/posts/feed';

function HomePage() {

    return (
        <main className="page">
            <h1>PetCircle</h1>
            <p>Le setup est en place. Les pages arrivent avec les stories S1 à S8.</p>
        </main>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/feed" element={<Feed />} />
            </Route>
        </Routes>
    );
}
