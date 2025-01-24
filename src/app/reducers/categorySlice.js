import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define individual API URLs for each category-related operation

// API URLs for categories
const GET_CATEGORIES_URL = 'https://api.mhbstore.com/api/categories';
const GET_CATEGORY_BY_ID_URL = (categoryId) => `https://api.mhbstore.com/api/categories/${categoryId}`;
const CREATE_CATEGORY_URL = 'https://api.mhbstore.com/api/categories';
const UPDATE_CATEGORY_URL = (categoryId) => `https://api.mhbstore.com/api/categories/${categoryId}`;
const DELETE_CATEGORY_URL = (categoryId) => `https://api.mhbstore.com/api/categories/${categoryId}`;
const UPDATE_CATEGORY_STATUS_URL = (categoryId) => `https://api.mhbstore.com/api/categories/${categoryId}`;

// Create async thunk for fetching all categories
export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const { data } = await axios.get(GET_CATEGORIES_URL);
  return data.data.results; // Return the category data from the results array
});

// Create async thunk for fetching a category by ID
export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (categoryId) => {
    const { data } = await axios.get(GET_CATEGORY_BY_ID_URL(categoryId));
    return data.data; // Return the category data
  }
);

// Create async thunk for adding a new category
export const addNewCategory = createAsyncThunk(
  'category/addNewCategory',
  async (categoryData) => {
    const { data } = await axios.post(CREATE_CATEGORY_URL, categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data; // Return the new category data
  }
);

// Create async thunk for updating a category
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, categoryData }) => {
    const { data } = await axios.patch(UPDATE_CATEGORY_URL(categoryId), categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure this matches backend expectations
      },
    });
    return data.data; // Return the updated category data
  }
);

// Create async thunk for toggling the published status of a category
export const updateCategoryStatus = createAsyncThunk(
  'category/updateCategoryStatus',
  async ({ categoryId, status }) => {
    const { data } = await axios.patch(
      UPDATE_CATEGORY_STATUS_URL(categoryId),
      { status }, // Send status instead of published
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data; // Return the updated category data
  }
);

// Create async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId) => {
    await axios.delete(DELETE_CATEGORY_URL(categoryId));
    return categoryId; // Return the deleted category ID
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    currentCategory: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle fetching a category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCategory = action.payload; // Store the fetched category
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle adding a new category
      .addCase(addNewCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle updating a category
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id // Ensure _id matches the backend response
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the category in the state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle updating category status
      .addCase(updateCategoryStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id // Ensure _id matches the backend response
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the category status in the state
        }
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle deleting a category
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload // Remove the deleted category from state
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
