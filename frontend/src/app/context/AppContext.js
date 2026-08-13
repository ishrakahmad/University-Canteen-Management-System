"use client";
import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  return (
    <AppContext.Provider value={{ token, userRole, userName }}>
      {children}
    </AppContext.Provider>
  );
};
