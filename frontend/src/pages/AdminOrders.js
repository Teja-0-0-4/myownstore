import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderHistory, updateOrderStatus } from '../redux/slices/orderSlice';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const { orders, token, isAdmin } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && isAdmin) dispatch(fetchOrderHistory());
  }, [dispatch, token, isAdmin]);

  if (!token || !isAdmin) {
    navigate('/login');
    return null;
  }

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  return (
    <div className="container">
      <h2>Manage Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;