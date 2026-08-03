import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const { user } = useAuth();

  const loadNotifications = async () => {
    if (user) {
      try {
        const res = await api.getNotifications();
        if (res.success) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Check periodically for demo simulation
    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      toasts,
      addToast,
      markAsRead,
      dismissToast,
      refreshNotifications: loadNotifications
    }}>
      {children}
      
      {/* Toast Notification HUD */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`glass-card p-4 rounded-xl shadow-gold-glow flex justify-between items-start border-l-4 transition-all duration-300 animate-bounce ${
              t.type === 'success' ? 'border-l-green-500' :
              t.type === 'warning' ? 'border-l-amber-500' :
              t.type === 'error' ? 'border-l-red-500' : 'border-l-gold'
            }`}
          >
            <div>
              <h4 className="font-semibold text-sm text-gold">{t.title}</h4>
              <p className="text-xs text-gray-300 mt-1">{t.message}</p>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-gray-400 hover:text-white text-xs ml-3 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
