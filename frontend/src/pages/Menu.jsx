import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, fetchCategories } from '../store/menuSlice';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Modal from '../components/Modal';
import API from '../services/api';
import './Menu.css';

const MenuManagement = () => {
  const dispatch = useDispatch();
  const { items, categories } = useSelector((state) => state.menu);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', isVeg: true, isAvailable: true, preparationTime: 15 });

  useEffect(() => {
    dispatch(fetchMenuItems());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await API.put(`/menu/${editItem._id}`, form);
      } else {
        await API.post('/menu', form);
      }
      dispatch(fetchMenuItems());
      setShowModal(false);
      setForm({ name: '', price: '', description: '', category: '', isVeg: true, isAvailable: true, preparationTime: 15 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, price: item.price, description: item.description || '', category: item.category?._id || '', isVeg: item.isVeg, isAvailable: item.isAvailable, preparationTime: item.preparationTime });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await API.delete(`/menu/${id}`);
      dispatch(fetchMenuItems());
    }
  };

  const filtered = items.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category?._id === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="menu-page fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Menu Management</h2>
          <p className="text-secondary">{items.length} items</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="menu-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Categories</option>
          {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>

      <div className="grid grid-3">
        {filtered.map((item) => (
          <div key={item._id} className="menu-item-card card">
            <div className="menu-item-header">
              <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
              <div className="menu-item-actions">
                <button className="btn-icon" onClick={() => handleEdit(item)}><Edit size={16} /></button>
                <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="menu-item-name">{item.name}</h4>
            <p className="text-secondary text-sm">{item.description}</p>
            <div className="menu-item-footer">
              <span className="menu-item-price">₹{item.price}</span>
              <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="menu-item-meta">
              <span>{item.category?.name}</span>
              <span>⏱ {item.preparationTime} min</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input type="number" className="form-input" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select...</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Prep Time (min)</label>
              <input type="number" className="form-input" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: +e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.value === 'true' })}>
                <option value="true">Vegetarian</option>
                <option value="false">Non-Veg</option>
              </select>
            </div>
          </div>
          <div className="flex gap-1">
            <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Add'} Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
