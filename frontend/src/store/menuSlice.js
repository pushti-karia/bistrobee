import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchMenuItems = createAsyncThunk('menu/fetchItems', async ({ category, search } = {}) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  const { data } = await API.get(`/menu?${params}`);
  return data;
});

export const fetchCategories = createAsyncThunk('menu/fetchCategories', async () => {
  const { data } = await API.get('/menu/categories');
  return data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    categories: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export default menuSlice.reducer;
