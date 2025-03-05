import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity, size }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('User should login');
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/cart/add`,
      { productId, quantity, size },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCart = createAsyncThunk('cart/update', async ({ productId, quantity, size }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/cart/update`,
      { productId, quantity, size },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;