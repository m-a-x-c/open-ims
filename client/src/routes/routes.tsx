import { createBrowserRouter } from 'react-router-dom';
import ProtectRoute from '../components/layout/ProtectRoute';
import Sidebar from '../components/layout/Sidebar';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const NotFound = () => (
  <div style={{ padding: 32 }}>
    <h1>404</h1>
    <p>Page not found.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Sidebar />,
    children: [
      {
        path: '/',
        element: (
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <NotFound /> },
]);
