import { createBrowserRouter } from 'react-router-dom';
import ProtectRoute from '../components/layout/ProtectRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const Home = () => (
  <div style={{ padding: 32 }}>
    <h1>Inventory Management System</h1>
    <p>Welcome.</p>
  </div>
);

const NotFound = () => (
  <div style={{ padding: 32 }}>
    <h1>404</h1>
    <p>Page not found.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectRoute>
        <Home />
      </ProtectRoute>
    ),
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <NotFound /> },
]);
