import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!token || !isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Analytics: [Placeholder - Orders, Sales, Users]</p>
      <Link to="/admin/products">Manage Products</Link>
      <Link to="/admin/orders">Manage Orders</Link>
    </div>
  );
};

export default AdminDashboard;