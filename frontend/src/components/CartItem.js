import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCart } from '../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (qty) => {
    const newQty = qty < 0 ? 0 : qty;
    dispatch(updateCart({ productId: item.product._id, quantity: newQty, size: item.size }));
  };

  return (
    <div className="cart-item">
      <img src={item.product.image} alt={item.product.name} />
      <div>
        <h3>{item.product.name}</h3>
        <p>${item.product.price} x {item.quantity}</p>
        <p>Size: {item.size}</p>
        <input
          type="number"
          min="0"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
          placeholder="Qty"
        />
      </div>
    </div>
  );
};

export default CartItem;