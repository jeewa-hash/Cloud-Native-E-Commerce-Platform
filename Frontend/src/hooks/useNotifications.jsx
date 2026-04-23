import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NOTIFICATION_SERVICE_URL } from '../apiConfig.js';

export const useNotifications = (roomId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);
  const socketRef = useRef(null);

  // Fetch from DB on mount
  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    axios.get(`${NOTIFICATION_SERVICE_URL}/api/notifications/${roomId}`)
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sorted);
        setUnreadCount(sorted.filter(n => !n.isRead).length);
      })
      .catch(err => console.error("Fetch notifications failed:", err.message))
      .finally(() => setLoading(false));
  }, [roomId]);

  // Socket.io real-time
  useEffect(() => {
    if (!roomId) return;

    const socket = io(NOTIFICATION_SERVICE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', roomId);
    });

    socket.on('notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Toast popup
      toast.custom((t) => (
        <div style={{
          background: 'white', width: 340, borderRadius: 14,
          borderLeft: '4px solid #e87722', padding: '14px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: 12,
          opacity: t.visible ? 1 : 0, transition: 'opacity 0.3s',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#e87722', marginBottom: 4 }}>
              New Order Received
            </div>
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.4 }}>
              {newNotif.message}
            </div>
          </div>
          <button onClick={() => toast.dismiss(t.id)}
            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 20 }}>
            ×
          </button>
        </div>
      ), { duration: 5000, position: 'top-right' });
    });

    return () => socket.disconnect();
  }, [roomId]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, loading, markAllRead, markOneRead };
};