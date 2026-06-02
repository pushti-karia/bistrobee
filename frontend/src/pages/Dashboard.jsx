import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Utensils } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatsCard from '../components/StatsCard';
import API from '../services/api';
import './Dashboard.css';

const COLORS = ['#F59E0B', '#F97316', '#10B981', '#3B82F6', '#8B5CF6'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/analytics/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const skeletonCards = Array(4).fill(null);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="grid grid-4">
          {skeletonCards.map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const revenueData = stats?.revenueByDay?.map((d) => ({
    date: new Date(d._id).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
    orders: d.orders
  })) || [];

  const popularItems = stats?.popularItems?.slice(0, 5) || [];
  
  const pieData = [
    { name: 'Dine-in', value: 45 },
    { name: 'Takeaway', value: 30 },
    { name: 'Delivery', value: 25 }
  ];

  return (
    <div className="dashboard fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Dashboard</h2>
          <p className="text-secondary">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="today-badge">
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-4 mb-3">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats?.totalRevenue || 0}
          prefix="₹"
          change={12}
          color="primary"
        />
        <StatsCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          change={8}
          color="info"
        />
        <StatsCard
          icon={TrendingUp}
          label="Today's Revenue"
          value={stats?.todayRevenue || 0}
          prefix="₹"
          change={5}
          color="success"
        />
        <StatsCard
          icon={Users}
          label="Today's Orders"
          value={stats?.todayOrders || 0}
          change={-3}
          color="danger"
        />
      </div>

      <div className="grid grid-2 mb-3">
        <div className="card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
            <span className="badge badge-primary">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Orders by Type</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2 mb-3">
        <div className="card">
          <div className="card-header">
            <h3>Daily Orders</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Popular Items</h3>
            <Utensils size={18} color="var(--text-secondary)" />
          </div>
          <div className="popular-items-list">
            {popularItems.map((item, i) => (
              <div key={i} className="popular-item">
                <div className="popular-rank">#{i + 1}</div>
                <div className="popular-info">
                  <p className="font-semibold">{item.item?.name || 'Menu Item'}</p>
                  <p className="text-sm text-secondary">{item.count} orders</p>
                </div>
                <div className="popular-revenue">₹{item.revenue?.toLocaleString()}</div>
              </div>
            ))}
            {popularItems.length === 0 && (
              <div className="empty-state">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
