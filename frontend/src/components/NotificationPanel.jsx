import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Tooltip from './Tooltip';

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axiosInstance.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function markAsRead(notificationId) {
    try {
      const response = await axiosInstance.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? response.data : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={panelRef}>
      <Tooltip text="Notifications">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-card hover:bg-gray-50 transition"
        >
          <Bell size={20} className="text-gray-500" />

          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-card shadow-soft-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 p-4">
              Loading...
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-400 p-4 text-center">
              No notifications yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`p-4 cursor-pointer transition ${
                    n.is_read
                      ? 'bg-white'
                      : 'bg-primary-50/40 hover:bg-primary-50'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      n.is_read
                        ? 'text-gray-500'
                        : 'text-gray-800 font-medium'
                    }`}
                  >
                    {n.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;