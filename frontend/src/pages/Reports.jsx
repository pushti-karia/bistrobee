import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  return (
    <div className="reports-page fade-in">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p className="text-secondary">Generate detailed business reports</p>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Date Range</h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-input" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input type="date" className="form-input" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button className="btn btn-primary">Apply Filter</button>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--primary)" /></div>
          <h4>Sales Report</h4>
          <p className="text-secondary">Detailed sales analysis and trends</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--success)" /></div>
          <h4>Tax Report</h4>
          <p className="text-secondary">GST and tax calculations</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--info)" /></div>
          <h4>Inventory Report</h4>
          <p className="text-secondary">Stock levels and consumption</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--warning)" /></div>
          <h4>Customer Report</h4>
          <p className="text-secondary">Customer behavior insights</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--danger)" /></div>
          <h4>Employee Report</h4>
          <p className="text-secondary">Performance and attendance</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
        <div className="report-card card">
          <div className="report-icon"><FileText size={32} color="var(--secondary)" /></div>
          <h4>Menu Performance</h4>
          <p className="text-secondary">Best selling items analysis</p>
          <button className="btn btn-outline mt-2"><Download size={16} /> Download</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
