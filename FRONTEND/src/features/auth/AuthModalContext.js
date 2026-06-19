import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    // Safe no-op fallback so components don't crash outside the provider.
    return { open: false, role: 'patient', mode: 'login', redirect: null, openAuth: () => {}, closeAuth: () => {} };
  }
  return ctx;
};

export const AuthModalProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, role: 'patient', mode: 'login', redirect: null });

  const openAuth = useCallback((opts = {}) => {
    setState({
      open: true,
      role: opts.role || 'patient',
      mode: opts.mode || 'login',
      redirect: opts.redirect || null,
    });
  }, []);

  const closeAuth = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return (
    <AuthModalContext.Provider value={{ ...state, openAuth, closeAuth }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalContext;
