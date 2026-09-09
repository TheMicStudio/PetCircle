import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './features/auth/auth.tsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LandingPage } from './features/landing/landing';
import { Feed } from './features/posts/feed';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/feed" element={<Feed />} />
            </Route>
        </Routes>
    );
}
