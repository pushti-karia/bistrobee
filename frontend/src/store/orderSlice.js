import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchOrders = createAsyncThunk('orders/fetch', async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const { data } = await API.get(`/orders?${params}`);
  return data;
});

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  const { data } = await API.post('/orders', orderData);
  return data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.current = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  }
});

export const { setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
