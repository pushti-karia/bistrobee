import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/orderSlice';
import { Search, Filter } from 'lucide-react';
import './Orders.css';

const statusColors = {
  placed: 'info',
  preparing: 'warning',
  ready: 'primary',
  completed: 'success',
  cancelled: 'danger'
};

const Orders = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.orders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchOrders(statusFilter ? { status: statusFilter } : {}));
  }, [dispatch, statusFilter]);

  const filtered = list.filter(
    (o) => o.orderNumber?.includes(search) || o.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="orders-page fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Orders</h2>
          <p className="text-secondary">{filtered.length} total orders</p>
        </div>
      </div>

      <div className="orders-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Status</option>
          <option value="placed">Placed</option>
          <option value="preparing">Preparing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Type</th>
              <th>Table</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order._id}>
                <td className="order-num">{order.orderNumber}</td>
                <td><span className={`badge badge-outline-${order.orderType === 'dine-in' ? 'primary' : 'success'}`}>{order.orderType}</span></td>
                <td>{order.table?.tableNumber || '-'}</td>
                <td>{order.items?.length} items</td>
                <td className="font-semibold">₹{order.total?.toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${statusColors[order.status] || 'info'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="text-secondary">{new Date(order.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
