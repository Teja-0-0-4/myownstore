import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductList = () => {
  const { products, suggestions } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleAddToCart = (productId, size) => {
    dispatch(addToCart({ productId, quantity: 1, size }));
  };

  return (
    <div className="product-list">
      {products.length ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <select onChange={(e) => handleAddToCart(product._id, e.target.value)}>
              <option value="">Select Size</option>
              {product.size.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={() => handleAddToCart(product._id, product.size[0] || '')}>
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>No products found. Try these suggestions:</p>
      )}
      {suggestions.map((suggestion) => (
        <div key={suggestion._id} className="product-card">
          <img src={suggestion.image} alt={suggestion.name} />
          <h3>{suggestion.name}</h3>
          <p>${suggestion.price}</p>
          <button onClick={() => handleAddToCart(suggestion._id, suggestion.size[0] || '')}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;