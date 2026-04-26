import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../NotificationService/NotificationCard';

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token') ||
                  localStorage.getItem('authToken') ||
                  sessionStorage.getItem('token');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.user || decoded;
  } catch { return null; }
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const roomId = user?.id || user?._id;

  const { notifications, unreadCount, loading, markAllRead, markOneRead } =
    useNotifications(roomId);

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
      Loading notifications...
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
            Notifications
          </h1>
          <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{
            background: 'none', border: '1.5px solid #e8e0d8',
            borderRadius: 10, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, color: '#4a3728', cursor: 'pointer',
          }}>
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: '#ccc', fontSize: 14,
        }}>
          No notifications yet
        </div>
      ) : (
        notifications.map(n => (
          <NotificationCard
            key={n._id}
            notification={n}
            onMarkRead={markOneRead}
            onViewOrder={(orderId) => navigate(`/orders/${orderId}`)}
          />
        ))
      )}
    </div>
  );
}