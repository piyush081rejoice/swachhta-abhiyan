// Service to record and notify emails dispatched by the system

const NOTIFICATIONS_KEY = 'swachhata_system_notifications';

export const notificationService = {
  getNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addNotification(notification) {
    const list = this.getNotifications();
    const newEntry = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    const updated = [newEntry, ...list].slice(0, 50); // keep last 50
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('swachhata_new_notification', { detail: newEntry }));
    return newEntry;
  },

  markAsRead(id) {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('swachhata_notifications_changed'));
  },

  markAllAsRead() {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('swachhata_notifications_changed'));
  },

  clearAll() {
    localStorage.removeItem(NOTIFICATIONS_KEY);
    window.dispatchEvent(new CustomEvent('swachhata_notifications_changed'));
  },

  getUnreadCount() {
    return this.getNotifications().filter(n => !n.read).length;
  }
};
