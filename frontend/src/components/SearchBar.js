import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { products, suggestions } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      dispatch(searchProducts({ q: e.target.value }));
    }
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setQuery('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
      />
      {query && (
        <ul className="search-suggestions">
          {(products.length ? products : suggestions).map((product) => (
            <li key={product._id} onClick={() => handleSelect(product._id)}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;