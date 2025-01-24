import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async function for creating a slider (POST request)
export const createSliderAsync = createAsyncThunk(
  'sliders/createSliderAsync',
  async (sliderData, thunkAPI) => {
    try {
      const response = await axios.post('https://api.mhbstore.com/api/homeslider', sliderData);
      return response.data.data; // Assuming response.data contains 'data' with the newly created slider
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create slider');
    }
  }
);

// Async function for fetching all sliders (GET request)
export const fetchSlidersAsync = createAsyncThunk(
  'sliders/fetchSlidersAsync',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('https://api.mhbstore.com/api/homeslider');
      return response.data.data; // Assuming response.data contains 'data' with the sliders
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch sliders');
    }
  }
);

// Async function for fetching a slider by ID (GET request)
export const fetchSliderByIdAsync = createAsyncThunk(
  'sliders/fetchSliderByIdAsync',
  async (sliderId, thunkAPI) => {
    try {
      const response = await axios.get(`https://api.mhbstore.com/api/homeslider/${sliderId}`);
      return response.data.data; // Assuming response.data contains 'data' with the slider details
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch slider');
    }
  }
);

// Async function for updating a slider (PATCH request)
export const updateSliderAsync = createAsyncThunk(
  'sliders/updateSliderAsync',
  async ({ sliderId, updatedData }, thunkAPI) => {
    try {
      const response = await axios.patch(`https://api.mhbstore.com/api/homeslider/${sliderId}`, updatedData);
      return response.data.data; // Assuming response.data contains 'data' with the updated slider
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to update slider');
    }
  }
);

// Async function for deleting a slider (DELETE request)
export const deleteSliderAsync = createAsyncThunk(
  'sliders/deleteSliderAsync',
  async (sliderId, thunkAPI) => {
    try {
      await axios.delete(`https://api.mhbstore.com/api/homeslider/${sliderId}`);
      return sliderId; // Return the ID of the slider that was deleted
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete slider');
    }
  }
);

const sliderSlice = createSlice({
  name: 'sliders',
  initialState: {
    list: [], // List of sliders
    currentSlider: null, // The current selected slider
    status: 'idle', // Add status for tracking async actions (idle, loading, etc.)
    error: null, // Error message
  },
  reducers: {
    addSlider: (state, action) => {
      state.list.push(action.payload); // Add new slider to list
    },
    setSliders: (state, action) => {
      state.list = action.payload; // Set all sliders from API or external source
    },
    setCurrentSlider: (state, action) => {
      state.currentSlider = action.payload; // Set the current slider
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlidersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSlidersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload; // Update the list of sliders with fetched data
      })
      .addCase(fetchSlidersAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload; // Set error message on rejection
      })
      .addCase(fetchSliderByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSliderByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentSlider = action.payload; // Set the current slider to the fetched slider
      })
      .addCase(fetchSliderByIdAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload; // Set error message on rejection
      })
      .addCase(createSliderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSliderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list.push(action.payload); // Add the new slider to the list
      })
      .addCase(createSliderAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload; // Set error message on rejection
      })
      .addCase(updateSliderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSliderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.list.findIndex(slider => slider._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload; // Update the slider in the list
        }
      })
      .addCase(updateSliderAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload; // Set error message on rejection
      })
      .addCase(deleteSliderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSliderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = state.list.filter(slider => slider._id !== action.payload); // Remove the slider by id
      })
      .addCase(deleteSliderAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload; // Set error message on rejection
      });
  },
});

export const { addSlider, setSliders, setCurrentSlider } = sliderSlice.actions;
export default sliderSlice.reducer;
