import { useEffect, useState } from 'react';
import API from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get('/employees').then(({ data }) => setEmployees(data)).catch(console.error);
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h2>Employee Management</h2>
          <p className="text-secondary">{employees.length} active employees</p>
        </div>
        <button className="btn btn-primary">Add Employee</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Shift</th>
              <th>Salary</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                <td className="font-semibold">{e.employeeId}</td>
                <td>{e.user?.name}</td>
                <td><span className="badge badge-outline-primary">{e.user?.role}</span></td>
                <td className="text-secondary">{e.user?.email}</td>
                <td>{e.shift}</td>
                <td>₹{e.salary?.toLocaleString()}</td>
                <td>{new Date(e.joiningDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
