import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to create a notification
export const createNotification = createAsyncThunk(
  'notification/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/notifications/create', notificationData);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async action to get all notifications
export const getAllNotifications = createAsyncThunk(
  'notification/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async action to get a notification by ID
export const getNotificationById = createAsyncThunk(
  'notification/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async action to update a notification by ID
export const updateNotification = createAsyncThunk(
  'notification/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/notifications/${id}`, updateData);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async action to delete a notification by ID
export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/api/notifications/${id}`);
      return id; // Return the ID to be deleted
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async action to toggle the status between 'Read' and 'Unread'
export const toggleNotificationStatus = createAsyncThunk(
  'notification/toggleStatus',
  async ({ id, currentStatus }, { rejectWithValue }) => {
    try {
      const newStatus = currentStatus === 'Unread' ? 'Read' : 'Unread'; // Toggle between Unread and Read
      const response = await axios.patch(`http://localhost:8000/api/notifications/${id}`, { status: newStatus });
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Action to mark all notifications as read
export const markNotificationsAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.patch('http://localhost:8000/api/notifications/mark-as-read');
      return response.data.notifications; // Assuming the server returns the updated notifications
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice for notifications
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    status: 'idle',  // can be 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications.push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Get all notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Get notification by ID
      .addCase(getNotificationById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNotificationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = [action.payload]; // Store as an array to maintain consistency
      })
      .addCase(getNotificationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update notification
      .addCase(updateNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.notifications.findIndex((notif) => notif._id === action.payload._id);
        if (index >= 0) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Toggle notification status
      .addCase(toggleNotificationStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleNotificationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.notifications.findIndex((notif) => notif._id === action.payload._id);
        if (index >= 0) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(toggleNotificationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Mark notifications as read
      .addCase(markNotificationsAsRead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload; // Update the notifications list
      })
      .addCase(markNotificationsAsRead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
