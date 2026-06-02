import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables } from '../store/tableSlice';
import './Tables.css';

const statusColors = {
  available: '#10B981',
  occupied: '#EF4444',
  reserved: '#F59E0B',
  billing: '#3B82F6'
};

const Tables = () => {
  const dispatch = useDispatch();
  const { list: tables } = useSelector((state) => state.tables);

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const statusCounts = tables.reduce((acc, table) => {
    acc[table.status] = (acc[table.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="tables-page fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Table Management</h2>
          <p className="text-secondary">Interactive floor layout</p>
        </div>
        <button className="btn btn-primary">Add Table</button>
      </div>

      <div className="grid grid-4 mb-3">
        <div className="stat-box" style={{ borderColor: statusColors.available }}>
          <span className="stat-label">Available</span>
          <span className="stat-value">{statusCounts.available || 0}</span>
        </div>
        <div className="stat-box" style={{ borderColor: statusColors.occupied }}>
          <span className="stat-label">Occupied</span>
          <span className="stat-value">{statusCounts.occupied || 0}</span>
        </div>
        <div className="stat-box" style={{ borderColor: statusColors.reserved }}>
          <span className="stat-label">Reserved</span>
          <span className="stat-value">{statusCounts.reserved || 0}</span>
        </div>
        <div className="stat-box" style={{ borderColor: statusColors.billing }}>
          <span className="stat-label">Billing</span>
          <span className="stat-value">{statusCounts.billing || 0}</span>
        </div>
      </div>

      <div className="card">
        <div className="table-floor">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`table-item table-${table.status}`}
              style={{
                left: table.position?.x || 0,
                top: table.position?.y || 0
              }}
            >
              <div className="table-number">{table.tableNumber}</div>
              <div className="table-capacity">👥 {table.capacity}</div>
              <div className="table-status">{table.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;
