import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './features/auth/auth.tsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { GuestRoute } from './features/auth/GuestRoute';
import { LandingPage } from './features/landing/landing';
import { Feed } from './features/posts/feed';
import { ProfilePage } from './features/profile/profile.tsx';
import PostDetail from './features/posts/postDetail';
import { NotFound } from './shared/components/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<GuestRoute />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
