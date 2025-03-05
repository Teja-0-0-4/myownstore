import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { searchProducts } from '../redux/slices/productSlice';
import SearchBar from './SearchBar';

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const token = auth ? auth.token : null;
  const isAdmin = auth ? auth.isAdmin : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    dispatch(searchProducts({ q: '', category }));
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <span>MyOwn Store</span>
        </Link>
        <div className="navbar-search">
          <SearchBar />
        </div>
        <div>
          <div className="categories-menu">
            <span className="hamburger">☰ Categories</span>
            <div className="categories-dropdown">
              <a onClick={() => handleCategoryClick('Clothing')}>Clothing</a>
              <a onClick={() => handleCategoryClick('Electronics')}>Electronics</a>
              <a onClick={() => handleCategoryClick('Accessories')}>Accessories</a>
            </div>
          </div>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/coupons">Coupons</Link> {/* New link */}
          {token ? (
            <>
              <Link to="/profile">Profile</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={() => { dispatch(logout()); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <footer className="footer">
        <p>© MyOwn Store - Operating Since 2010</p>
      </footer>
    </>
  );
};

export default Navbar;