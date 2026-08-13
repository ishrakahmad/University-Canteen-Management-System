"use client";
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const normalizeRole = (roleValue) =>
    typeof roleValue === 'string' ? roleValue.trim().toLowerCase() : '';

  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserRole(normalizeRole(decoded?.role));
        setUserName(decoded.fullName);
        setUserId(decoded.sub);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode(newToken);
    setUserRole(normalizeRole(decoded?.role));
    setUserName(decoded.fullName);
    setUserId(decoded.sub);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setUserId(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AppContext.Provider value={{ token, userRole, userName, userId, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
