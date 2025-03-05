import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from './ProductCard';

const ProductView = () => {
  const { productId } = useParams();
  const { products, suggestions } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const product = products.find(p => p._id === productId);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (!product) {
      dispatch(searchProducts({ q: '' }));
    }
  }, [dispatch, product]);

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
    dispatch(addToCart({ productId: product._id, quantity, size: selectedSize || product.size[0] || '' }))
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

  if (!product) return <p>Loading...</p>;

  // Filter suggestions for better deals (cheaper than current product)
  const betterDeals = (suggestions || []).filter(s => s.price < product.price).slice(0, 4);

  return (
    <div className="container">
      <div className="product-view">
        <img src={product.image} alt={product.name} />
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
          <p>{product.description}</p>
          <label>Size:</label>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">Select Size</option>
            {product.size.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
          <button onClick={handleAddToCart}>Add to Cart</button>
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
      <div className="suggestions-section">
        <h3>Better Deals</h3>
        <div className="product-list">
          {betterDeals.length > 0 ? (
            betterDeals.map((suggestion) => (
              <ProductCard key={suggestion._id} product={suggestion} />
            ))
          ) : (
            <p>No better deals available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;