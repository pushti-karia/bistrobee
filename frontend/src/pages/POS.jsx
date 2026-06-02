import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, X, ShoppingCart, Receipt, Search } from 'lucide-react';
import { fetchMenuItems, fetchCategories } from '../store/menuSlice';
import { createOrder } from '../store/orderSlice';
import { fetchTables } from '../store/tableSlice';
import Modal from '../components/Modal';
import API from '../services/api';
import './POS.css';

const POS = () => {
  const dispatch = useDispatch();
  const { items, categories } = useSelector((state) => state.menu);
  const { list: tables } = useSelector((state) => state.tables);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState({
    orderType: 'dine-in',
    table: '',
    paymentMethod: 'cash',
    customerNotes: ''
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMenuItems());
    dispatch(fetchTables());
  }, [dispatch]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map((c) => {
      if (c._id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((c) => c._id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!orderForm.table && orderForm.orderType === 'dine-in') {
      alert('Please select a table');
      return;
    }

    const orderData = {
      ...orderForm,
      items: cart.map((c) => ({
        menuItem: c._id,
        name: c.name,
        quantity: c.quantity,
        price: c.price
      })),
      subtotal,
      tax,
      total,
      paymentStatus: 'paid'
    };

    try {
      await dispatch(createOrder(orderData));
      setCart([]);
      setShowCheckout(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category?._id === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch && item.isAvailable;
  });

  return (
    <div className="pos-page fade-in">
      <div className="pos-left">
        <div className="pos-header">
          <h2>POS Billing</h2>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`category-tab ${selectedCategory === cat._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="menu-card" onClick={() => addToCart(item)}>
              <div className="menu-card-image">
                {item.image ? <img src={item.image} alt={item.name} /> : <span>🍽️</span>}
              </div>
              <div className="menu-card-content">
                <h4>{item.name}</h4>
                <p className="menu-card-desc">{item.description}</p>
                <div className="flex-between">
                  <span className="menu-card-price">₹{item.price}</span>
                  {item.isVeg !== undefined && (
                    <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-right">
        <div className="cart-header">
          <ShoppingCart size={20} />
          <h3>Current Order</h3>
          <span className="cart-count">{cart.length}</span>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} color="var(--text-tertiary)" />
            <p>No items in cart</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => updateQuantity(item._id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)}>
                      <Plus size={14} />
                    </button>
                    <button className="btn-remove" onClick={() => removeFromCart(item._id)}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="cart-item-total">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => setShowCheckout(true)}>
              <Receipt size={18} />
              Proceed to Checkout
            </button>
          </>
        )}
      </div>

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Complete Order"
        size="md"
      >
        <div className="checkout-form">
          <div className="form-group">
            <label className="form-label">Order Type</label>
            <select
              className="form-select"
              value={orderForm.orderType}
              onChange={(e) => setOrderForm({ ...orderForm, orderType: e.target.value })}
            >
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {orderForm.orderType === 'dine-in' && (
            <div className="form-group">
              <label className="form-label">Select Table</label>
              <select
                className="form-select"
                value={orderForm.table}
                onChange={(e) => setOrderForm({ ...orderForm, table: e.target.value })}
              >
                <option value="">Choose table...</option>
                {tables.filter((t) => t.status === 'available').map((t) => (
                  <option key={t._id} value={t._id}>{t.tableNumber}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={orderForm.paymentMethod}
              onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customer Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={orderForm.customerNotes}
              onChange={(e) => setOrderForm({ ...orderForm, customerNotes: e.target.value })}
              placeholder="Any special instructions..."
            />
          </div>

          <div className="checkout-summary">
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleCheckout}>
            Complete Order
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default POS;
