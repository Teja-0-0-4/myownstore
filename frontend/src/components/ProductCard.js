import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [selectedSize, setSelectedSize] = useState(''); // Track selected size

  const handleAddToCart = () => {
    if (!token) {
      setMessage('User should login');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!selectedSize && product.size.length > 0) {
      setMessage('Please select a size');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1, size: selectedSize || product.size[0] || '' }))
      .unwrap()
      .then(() => {
        setMessage('Cart added successfully');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((error) => {
        setMessage(error.message || 'Failed to add to cart');
        setTimeout(() => setMessage(''), 3000);
      });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} onClick={() => navigate(`/product/${product._id}`)} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
        <option value="">Select Size</option>
        {product.size.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ProductCard;