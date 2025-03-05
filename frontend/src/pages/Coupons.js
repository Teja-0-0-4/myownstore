import React from 'react';
import { useNavigate } from 'react-router-dom';

const Coupons = () => {
  const navigate = useNavigate();

  // Example coupon data (replace with backend fetch if available)
  const coupons = [
    { code: 'SAVE10', discount: '10% off', description: 'Get 10% off your order' },
    { code: 'FREESHIP', discount: 'Free Shipping', description: 'Free shipping on orders over $50' },
    { code: 'WELCOME20', discount: '20% off', description: 'New user discount' }
  ];

  return (
    <div className="container">
      <div className="profile-container">
        <h2>Available Coupons</h2>
        {coupons.length === 0 ? (
          <p>No coupons available</p>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.code} className="coupon-item" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <span>{coupon.code} - {coupon.discount} | {coupon.description}</span>
              <button onClick={() => navigator.clipboard.writeText(coupon.code)}>Copy Code</button>
            </div>
          ))
        )}
        <button onClick={() => navigate('/checkout')}>Go to Checkout</button>
      </div>
    </div>
  );
};

export default Coupons;