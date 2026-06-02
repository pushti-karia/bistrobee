import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import API from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    API.get('/inventory').then(({ data }) => setInventory(data)).catch(console.error);
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p className="text-secondary">{inventory.length} items tracked</p>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Min Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td className="font-semibold">{item.name}</td>
                <td>{item.currentStock}</td>
                <td>{item.unit}</td>
                <td>{item.minStockLevel}</td>
                <td>
                  {item.currentStock <= item.minStockLevel ? (
                    <span className="badge badge-danger flex gap-1" style={{ width: 'fit-content' }}>
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : (
                    <span className="badge badge-success">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
