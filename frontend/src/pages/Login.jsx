import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: 'admin@bistrobee.com', password: 'admin123' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (result.type.includes('fulfilled')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <span>🐝</span>
          </div>
          <h1>BistroBee</h1>
          <p>Smart Restaurant Management Simplified</p>
        </div>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <h4>Lightning Fast POS</h4>
              <p>Process orders in seconds</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <div>
              <h4>Real-time Analytics</h4>
              <p>Track revenue and performance</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍳</span>
            <div>
              <h4>Kitchen Display</h4>
              <p>Seamless kitchen coordination</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back!</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-group">
                <Mail size={18} />
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@bistrobee.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-group">
                <Lock size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="input-suffix" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="spin">⟳</span> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Accounts</p>
            <div className="demo-grid">
              <button onClick={() => setForm({ email: 'admin@bistrobee.com', password: 'admin123' })}>Admin</button>
              <button onClick={() => setForm({ email: 'manager@bistrobee.com', password: 'manager123' })}>Manager</button>
              <button onClick={() => setForm({ email: 'cashier@bistrobee.com', password: 'cashier123' })}>Cashier</button>
              <button onClick={() => setForm({ email: 'kitchen@bistrobee.com', password: 'kitchen123' })}>Kitchen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
