import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderHistory, cancelOrder } from '../redux/slices/orderSlice';

const OrderHistory = () => {
  const { orders } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(fetchOrderHistory());
  }, [dispatch, token]);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>Order ID: {order._id}</p>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
            {order.status === 'Pending' && (
              <button onClick={() => dispatch(cancelOrder(order._id))}>Cancel Order</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;