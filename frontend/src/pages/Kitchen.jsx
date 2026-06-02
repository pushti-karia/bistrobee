import { useEffect, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import API from '../services/api';
import './Kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders?status=placed&status=preparing');
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      await API.put(`/orders/${orderId}/items/${itemId}`, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId ? { ...item, status } : item
                )
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((Date.now() - new Date(date)) / 60000);
    return `${minutes}m ago`;
  };

  return (
    <div className="kitchen-page fade-in">
      <div className="page-header">
        <h2>Kitchen Display System</h2>
        <p className="text-secondary">Real-time order tracking · {orders.length} active orders</p>
      </div>

      <div className="kitchen-grid">
        {orders.map((order) => (
          <div key={order._id} className="kitchen-card">
            <div className="kitchen-header">
              <div>
                <span className="order-number">{order.orderNumber}</span>
                <span className={`order-type-badge ${order.orderType}`}>{order.orderType}</span>
              </div>
              <div className="order-time">
                <Clock size={14} />
                {getTimeSince(order.createdAt)}
              </div>
            </div>

            <div className="kitchen-items">
              {order.items.map((item) => (
                <div key={item._id} className={`kitchen-item ${item.status}`}>
                  <div className="item-info">
                    <span className="item-qty">{item.quantity}x</span>
                    <div>
                      <p className="item-name">{item.name}</p>
                      {item.notes && <p className="item-notes">Note: {item.notes}</p>}
                    </div>
                  </div>
                  <div className="item-actions">
                    {item.status === 'pending' && (
                      <button
                        className="btn-status preparing"
                        onClick={() => updateItemStatus(order._id, item._id, 'preparing')}
                      >
                        Start
                      </button>
                    )}
                    {item.status === 'preparing' && (
                      <button
                        className="btn-status ready"
                        onClick={() => updateItemStatus(order._id, item._id, 'ready')}
                      >
                        <CheckCircle size={14} />
                        Ready
                      </button>
                    )}
                    {item.status === 'ready' && (
                      <span className="status-badge ready">✓ Ready</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {order.table && (
              <div className="kitchen-footer">
                Table: <strong>{order.table.tableNumber}</strong>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-state-large">
            <div className="empty-icon">🍳</div>
            <h3>No Active Orders</h3>
            <p>All orders completed! Great job team.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
