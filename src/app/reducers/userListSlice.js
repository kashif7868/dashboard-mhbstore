import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for fetching, updating, and deleting users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://api.mhbstore.com/api/auth/');
  // Map data to required format with sequential IDs
  const usersWithSequentialId = response.data.results.map((user, index) => ({
    id: index + 1,  // Sequential ID
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }));
  return usersWithSequentialId;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`https://api.mhbstore.com/api/auth/users/${userId}`);
  return userId;  // Return userId to remove from state
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }) => {
  const { data } = await axios.patch(`https://api.mhbstore.com/api/auth/users/${userId}`, userData);
  return data;  // Return the updated user data
});

const userListSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userListSlice.reducer;
