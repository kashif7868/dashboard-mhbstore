import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://api.mhbstore.com/api/smallcategory';

// Async Thunks
export const fetchAllSmallCategories = createAsyncThunk(
  'smallCategory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSmallCategoryById = createAsyncThunk(
  'smallCategory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createSmallCategory = createAsyncThunk(
  'smallCategory/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSmallCategory = createAsyncThunk(
  'smallCategory/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSmallCategory = createAsyncThunk(
  'smallCategory/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const smallCategorySlice = createSlice({
  name: 'smallCategory',
  initialState: {
    smallCategories: [],
    smallCategory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSmallCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSmallCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.smallCategories = action.payload;
      })
      .addCase(fetchAllSmallCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSmallCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmallCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.smallCategory = action.payload;
      })
      .addCase(fetchSmallCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSmallCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSmallCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.smallCategories.push(action.payload);
      })
      .addCase(createSmallCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSmallCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSmallCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.smallCategories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.smallCategories[index] = action.payload;
        }
      })
      .addCase(updateSmallCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSmallCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSmallCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.smallCategories = state.smallCategories.filter((cat) => cat._id !== action.meta.arg);
      })
      .addCase(deleteSmallCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default smallCategorySlice.reducer;
