import { useEffect, useState } from 'react';
import API from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantEmail: '',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 5,
    taxName: 'GST',
    receiptFooter: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    API.get('/settings').then(({ data }) => setSettings(data)).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await API.put('/settings', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="text-secondary">Restaurant configuration</p>
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: '24px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius)' }}>Settings saved successfully!</div>}

      <form onSubmit={handleSave}>
        <div className="card mb-3">
          <h3 className="mb-2">Restaurant Profile</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input className="form-input" value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={settings.restaurantPhone} onChange={(e) => setSettings({ ...settings, restaurantPhone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={settings.restaurantEmail} onChange={(e) => setSettings({ ...settings, restaurantEmail: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" value={settings.restaurantAddress} onChange={(e) => setSettings({ ...settings, restaurantAddress: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <h3 className="mb-2">Tax & Currency</h3>
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Tax Name</label>
              <input className="form-input" value={settings.taxName} onChange={(e) => setSettings({ ...settings, taxName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input type="number" className="form-input" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: +e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <input className="form-input" value={settings.currencySymbol} onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <h3 className="mb-2">Receipt</h3>
          <div className="form-group">
            <label className="form-label">Receipt Footer</label>
            <textarea className="form-textarea" rows="3" value={settings.receiptFooter} onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })} placeholder="Thank you for visiting..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
