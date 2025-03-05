import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  const handleQuantityChange = (productId, size, qty) => {
    dispatch(updateCart({ productId, quantity: qty, size }));
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        items.map((item) => (
          <div key={`${item.product._id}-${item.size}`} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <h3>{item.product.name}</h3>
            <p>${item.product.price}</p>
            <p>Size: {item.size}</p>
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.product._id, item.size, parseInt(e.target.value))}
            />
          </div>
        ))
      )}
      {items.length > 0 && <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>}
    </div>
  );
};

export default Cart;