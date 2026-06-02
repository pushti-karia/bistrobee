import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Shield } from 'lucide-react';
import API from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await API.put('/auth/profile', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Profile</h2>
        <p className="text-secondary">Manage your account information</p>
      </div>

      {saved && <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 'var(--radius)', marginBottom: '24px' }}>Profile updated!</div>}

      <div className="grid grid-2">
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', color: 'white', fontWeight: '700' }}>
              {user?.name?.charAt(0)}
            </div>
            <h3>{user?.name}</h3>
            <p className="text-secondary">{user?.email}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize', padding: '8px 24px' }}>
              <Shield size={14} style={{ marginRight: '6px' }} /> {user?.role}
            </span>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-3">Edit Profile</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
