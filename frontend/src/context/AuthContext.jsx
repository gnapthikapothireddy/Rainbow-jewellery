import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('rainbow_token');
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('rainbow_token');
          }
        } catch (err) {
          console.error('Failed to load profile session:', err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('rainbow_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, phone });
      if (res.success) {
        localStorage.setItem('rainbow_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (payload) => {
    setLoading(true);
    try {
      const res = await api.googleLogin(payload);
      if (res.success) {
        localStorage.setItem('rainbow_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Google Login failed' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rainbow_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success) {
        setUser(prev => ({ ...prev, ...res.data }));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
