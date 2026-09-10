import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredNotifications,
  markStoredNotificationRead,
  markAllStoredNotificationsRead,
  addStoredNotification
} from '../services/mockStorage';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(getStoredNotifications());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleNotifChange = () => {
      setNotifications(getStoredNotifications());
    };
    window.addEventListener('dropick_notifications_changed', handleNotifChange);
    return () => window.removeEventListener('dropick_notifications_changed', handleNotifChange);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = (id) => {
    markStoredNotificationRead(id);
  };

  const markAllRead = () => {
    markAllStoredNotificationsRead();
  };

  const pushNotification = (notif) => {
    return addStoredNotification(notif);
  };

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        toggleDrawer,
        closeDrawer,
        markRead,
        markAllRead,
        pushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
