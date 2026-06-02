import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, BarChart3, 
  Package, Users, TableProperties, ClipboardList,
  ChefHat, UserCog, Bell, Settings, X
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'cashier', 'kitchen'] },
  { to: '/pos', icon: ShoppingCart, label: 'POS Billing', roles: ['admin', 'manager', 'cashier'] },
  { to: '/orders', icon: ClipboardList, label: 'Orders', roles: ['admin', 'manager', 'cashier', 'kitchen'] },
  { to: '/tables', icon: TableProperties, label: 'Tables', roles: ['admin', 'manager', 'cashier'] },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen', roles: ['admin', 'manager', 'kitchen'] },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu', roles: ['admin', 'manager'] },
  { to: '/inventory', icon: Package, label: 'Inventory', roles: ['admin', 'manager'] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['admin', 'manager', 'cashier'] },
  { to: '/employees', icon: UserCog, label: 'Employees', roles: ['admin', 'manager'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager'] },
  { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'manager', 'cashier', 'kitchen'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <span>🐝</span>
            </div>
            <div>
              <h1 className="logo-name">BistroBee</h1>
              <p className="logo-tagline">Smart POS</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-tertiary" style={{ fontSize: '12px', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
