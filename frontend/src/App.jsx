import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import LettersListPage from "./pages/letters/LettersListPage.jsx";
import LetterFormPage from "./pages/letters/LetterFormPage.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import PageShell from "./components/layout/PageShell.jsx";
import { useAuth } from "./hooks/useAuth.jsx";
import LogsPage from './pages/admin/LogsPage.jsx'

function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  // while auth provider is initializing, avoid redirecting
  if (loading) return null
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <PageShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/letters" replace />} />
        <Route path="letters" element={<LettersListPage />} />
        <Route path="letters/new" element={<LetterFormPage />} />
        <Route path="admin/users" element={<UsersPage />} />
         <Route path="admin/logs" element={<LogsPage />} /> {/* baru */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
  );
}