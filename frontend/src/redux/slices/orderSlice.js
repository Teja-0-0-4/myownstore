import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('orders/create', async (couponCode, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/orders`,
      { couponCode },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchOrderHistory = createAsyncThunk('orders/history', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/history`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (orderId, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ orderId, status }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.token) return rejectWithValue('Not logged in');
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push({ 
          ...action.payload, 
          tracking: { status: 'Ordered', date: new Date().toISOString() },
          couponCode: action.meta.arg // Store couponCode from thunk arg
        });
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orders = action.payload.map(order => ({
          ...order,
          tracking: order.tracking || { status: order.status === 'Pending' ? 'Ordered' : order.status, date: new Date().toISOString() }
        }));
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = { ...action.payload, tracking: { status: 'Cancelled', date: new Date().toISOString() } };
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = { ...action.payload, tracking: { status: action.payload.status, date: new Date().toISOString() } };
      });
  }
});

export default orderSlice.reducer;