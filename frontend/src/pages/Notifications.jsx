import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import API from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get('/notifications').then(({ data }) => setNotifications(data)).catch(console.error);
  }, []);

  const markAllRead = async () => {
    await API.put('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const colors = { order: 'primary', inventory: 'danger', system: 'info', alert: 'warning' };

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Notifications</h2>
          <p className="text-secondary">{notifications.filter((n) => !n.isRead).length} unread</p>
        </div>
        <button className="btn btn-outline" onClick={markAllRead}>
          <CheckCheck size={16} /> Mark All Read
        </button>
      </div>
      <div className="card">
        {notifications.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px' }}>
            <Bell size={48} color="var(--text-tertiary)" />
            <p style={{ marginTop: '16px' }}>No notifications</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {notifications.map((n) => (
              <div key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`} style={{
                padding: '16px',
                background: n.isRead ? 'transparent' : 'rgba(245,158,11,0.05)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: n.isRead ? 'var(--text-tertiary)' : 'var(--primary)',
                  marginTop: '6px',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-secondary">{n.message}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`badge badge-${colors[n.type] || 'info'}`}>{n.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
