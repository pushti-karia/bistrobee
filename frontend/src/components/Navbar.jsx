import { Bell, Search, Moon, Sun, User, LogOut, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="btn-icon menu-toggle" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="btn-icon" onClick={() => dispatch(toggleTheme())}>
          {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="btn-icon notification-btn">
          <Bell size={20} />
          <span className="badge-dot"></span>
        </button>
        
        <div className="user-menu">
          <button className="user-avatar">
            <User size={20} />
          </button>
          <div className="user-dropdown">
            <div className="user-info">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-secondary">{user?.role}</p>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              <User size={16} />
              Profile
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
