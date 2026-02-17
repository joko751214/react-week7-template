import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { checkLogin } from '@/api/server/login';

const getTokenFromCookie = () => document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');

export const AdminGuard = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const isActiveRef = useRef(false);

  const redirectToLogin = useCallback(() => navigate('/login', { replace: true }));
  const redirectToAdmin = useCallback(() => navigate('/admin/product', { replace: true }));

  const finish = useCallback((next) => {
    if (!isActiveRef.current) return;
    if (next) {
      next();
    } else {
      setChecking(false);
    }
  }, []);

  const verify = useCallback(async () => {
    try {
      await checkLogin();
      finish(mode === 'login' ? redirectToAdmin : null);
    } catch (error) {
      finish(mode === 'admin' ? redirectToLogin : null);
    }
  }, [finish, mode, redirectToAdmin, redirectToLogin]);

  useEffect(() => {
    isActiveRef.current = true;
    setChecking(true);
    const shouldSkipCheck = mode === 'admin' && Boolean(location.state?.skipAuthCheck);
    const token = getTokenFromCookie();

    if (!token) {
      finish(mode === 'admin' ? redirectToLogin : null);
      return () => {
        isActiveRef.current = false;
      };
    }

    if (shouldSkipCheck) {
      finish();
      return () => {
        isActiveRef.current = false;
      };
    }

    verify();

    return () => {
      isActiveRef.current = false;
    };
  }, [finish, location.pathname, location.state, mode, redirectToLogin, verify]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Checking login...</div>;
  }

  return <Outlet />;
};
