import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import CartItem from '../components/CartItem';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  if (!token) return <p>Please log in to view your cart.</p>;

  return (
    <div className="container">
      <div className="cart-container">
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {items.map((item) => (
              <CartItem key={`${item.product._id}-${item.size}`} item={item} />
            ))}
            <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;