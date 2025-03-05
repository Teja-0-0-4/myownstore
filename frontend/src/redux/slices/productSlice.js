import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/search`);
  return res.data;
});

export const searchProducts = createAsyncThunk('products/search', async ({ q, category }) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/search`, {
    params: { q, category }
  });
  return res.data;
});

export const addProduct = createAsyncThunk('products/add', async (formData, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData, {
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (productId, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return productId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], suggestions: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.suggestions = action.payload.suggestions;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.suggestions = action.payload.suggestions;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  }
});

export default productSlice.reducer;