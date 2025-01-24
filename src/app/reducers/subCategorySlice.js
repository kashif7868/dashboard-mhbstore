import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for CRUD operations

// Fetch all subcategories
export const fetchSubCategories = createAsyncThunk(
  'subcategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.mhbstore.com/api/subcategory'); // Ensure the API endpoint is correct
      console.log('Fetched Subcategories:', response.data);  // Log the response to check the structure
      if (response.data && Array.isArray(response.data)) {
        return response.data; // Directly return the array
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single subcategory by ID
export const fetchSubCategoryById = createAsyncThunk(
  'subcategories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.mhbstore.com/api/subcategory/${id}`);
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Add a new subcategory
export const addSubCategory = createAsyncThunk(
  'subcategories/add',
  async (subCategoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://api.mhbstore.com/api/subcategory', subCategoryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Delete a subcategory
export const deleteSubCategory = createAsyncThunk(
  'subcategories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://api.mhbstore.com/api/subcategory/${id}`);
      return id;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Update a subcategory
export const updateSubCategory = createAsyncThunk(
  'subcategories/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`https://api.mhbstore.com/api/subcategory/${id}`, updatedData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

// Subcategory slice
const subCategorySlice = createSlice({
  name: 'subcategories',
  initialState: {
    subcategories: [],
    selectedSubCategory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch all subcategories
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error in case of failure
      })

      // Handle fetch subcategory by ID
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubCategory = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle add subcategory
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.subcategories.push(action.payload);
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle delete subcategory
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.subcategories = state.subcategories.filter(
          (subcategory) => subcategory._id !== action.payload
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle update subcategory
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const index = state.subcategories.findIndex(
          (subcategory) => subcategory._id === action.payload._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default subCategorySlice.reducer;
