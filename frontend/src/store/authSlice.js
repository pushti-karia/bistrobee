import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  localStorage.setItem('token', data.token);
  return data;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  localStorage.setItem('token', data.token);
  return data;
});

export const getProfile = createAsyncThunk('auth/profile', async () => {
  const { data } = await API.get('/auth/me');
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
