import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const { products, token, isAdmin } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', size: '', description: '', image: null
  });

  if (!token || !isAdmin) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    dispatch(addProduct(data)).then(() => setFormData({
      name: '', category: '', price: '', stock: '', size: '', description: '', image: null
    }));
  };

  return (
    <div className="container">
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
        <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
        <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" />
        <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Stock" />
        <input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="Size (comma-separated)" />
        <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
        <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
        <button type="submit">Add Product</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => dispatch(deleteProduct(product._id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;