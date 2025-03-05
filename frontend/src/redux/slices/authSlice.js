import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    return { token: res.data.token, isAdmin: email === 'admin@example.com' };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, { email, password });
    localStorage.setItem('token', res.data.token);
    return { token: res.data.token, isAdmin: email === 'admin@example.com' };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token') || null, isAdmin: false },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAdmin = action.payload.isAdmin;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;