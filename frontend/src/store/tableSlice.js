import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchTables = createAsyncThunk('tables/fetch', async () => {
  const { data } = await API.get('/tables');
  return data;
});

export const updateTable = createAsyncThunk('tables/update', async ({ id, updates }) => {
  const { data } = await API.put(`/tables/${id}`, updates);
  return data;
});

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  }
});

export default tableSlice.reducer;
