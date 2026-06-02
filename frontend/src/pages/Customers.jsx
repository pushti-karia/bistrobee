import { useEffect, useState } from 'react';
import API from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get('/customers').then(({ data }) => setCustomers(data)).catch(console.error);
  }, []);

  const tierColors = { bronze: 'info', silver: 'primary', gold: 'warning', platinum: 'success' };

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Customer Management</h2>
          <p className="text-secondary">{customers.length} registered customers</p>
        </div>
        <button className="btn btn-primary">Add Customer</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Points</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td className="font-semibold">{c.name}</td>
                <td>{c.phone}</td>
                <td className="text-secondary">{c.email || '-'}</td>
                <td><span className={`badge badge-${tierColors[c.membershipTier]}`}>{c.membershipTier}</span></td>
                <td>{c.loyaltyPoints}</td>
                <td>{c.totalOrders}</td>
                <td className="font-semibold">₹{c.totalSpent?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
