import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderHistory, cancelOrder } from '../redux/slices/orderSlice';

const Profile = () => {
  const { orders } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(fetchOrderHistory());
  }, [dispatch, token]);

  if (!token) return <p>Please log in to view your profile.</p>;

  const getTrackingProgress = (status) => {
    const stages = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
    return stages.indexOf(status) + 1;
  };

  return (
    <div className="container">
      <div className="profile-container">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>Order ID: {order._id} | Total: ${order.total} | Status: {order.status} {order.couponCode ? `| Coupon: ${order.couponCode}` : ''}</span>
                {order.status === 'Pending' && (
                  <button onClick={() => dispatch(cancelOrder(order._id))}>Cancel Order</button>
                )}
              </div>
              <div className="tracking-section">
                <h3>Tracking</h3>
                <div className="tracking-steps">
                  <div className={`tracking-step ${order.tracking.status === 'Ordered' || order.tracking.status !== 'Cancelled' ? 'completed' : ''}`}>
                    <span>Ordered</span>
                  </div>
                  <div className={`tracking-step ${order.tracking.status === 'Shipped' || order.tracking.status === 'Out for Delivery' || order.tracking.status === 'Delivered' ? 'completed' : ''}`}>
                    <span>Shipped</span>
                  </div>
                  <div className={`tracking-step ${order.tracking.status === 'Out for Delivery' || order.tracking.status === 'Delivered' ? 'completed' : ''}`}>
                    <span>Out for Delivery</span>
                  </div>
                  <div className={`tracking-step ${order.tracking.status === 'Delivered' ? 'completed' : ''}`}>
                    <span>Delivered</span>
                  </div>
                  <div className={`tracking-line ${order.tracking.status !== 'Cancelled' ? 'completed' : ''}`} style={{ width: `${(getTrackingProgress(order.tracking.status) - 1) * 33}%` }}></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;