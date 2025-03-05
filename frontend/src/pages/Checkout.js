import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice'; // Corrected import
import { clearCart } from '../redux/slices/cartSlice'; // Keep clearCart from cartSlice
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 0; // Example: 10% off with SAVE10
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (couponCode) {
      setAppliedCoupon(couponCode); // Simulate applying coupon (replace with backend logic if available)
    }
  };

  const handleCheckout = () => {
    if (!token && !guestEmail) {
      alert('Please log in or enter an email for guest checkout');
      navigate('/login');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    dispatch(createOrder(appliedCoupon || couponCode))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        navigate('/profile');
      })
      .catch((error) => alert(error.message || 'Checkout failed'));
  };

  if (items.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="container">
      <div className="checkout-container">
        <div className="checkout-items">
          <h2>Checkout</h2>
          <h3>Delivery Address</h3>
          <p>[Placeholder - Enter your address here]</p>
          <h3>Review Items</h3>
          {items.map((item) => (
            <div key={`${item.product._id}-${item.size}`} className="cart-item">
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <p>{item.product.name}</p>
                <p>{item.size} x {item.quantity} - ${item.product.price * item.quantity}</p>
              </div>
            </div>
          ))}
          {!token && (
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Guest Email (required)"
            />
          )}
          <div className="coupon-section">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
            />
            <button onClick={handleApplyCoupon}>Apply Coupon</button>
          </div>
          <div className="payment-options">
            <h3>Payment Options</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="Credit/Debit Card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="Net Banking"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Net Banking
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
          </div>
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <p>Items: {items.length}</p>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {discount > 0 && <p>Discount ({appliedCoupon}): -${discount.toFixed(2)}</p>}
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={handleCheckout}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;