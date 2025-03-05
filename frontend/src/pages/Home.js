import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productSlice';

const Home = () => {
  const { products, suggestions } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="product-list">
        {(products.length ? products : suggestions).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;