// src/app/reducers/adsCenterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all ads
export const fetchAds = createAsyncThunk("ads/fetchAds", async () => {
  const response = await fetch("https://api.mhbstore.com/api/ads");
  const data = await response.json();
  return data;
});

// Async thunk to create a new ad
export const createAd = createAsyncThunk("ads/createAd", async (formData) => {
  const response = await fetch("https://api.mhbstore.com/api/ads", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
});

// Async thunk to fetch ad by ID
export const fetchAdById = createAsyncThunk("ads/fetchAdById", async (id) => {
  const response = await fetch(`https://api.mhbstore.com/api/ads/${id}`);
  const data = await response.json();
  return data;
});

// Async thunk to update an ad
export const updateAd = createAsyncThunk("ads/updateAd", async ({ id, formData }) => {
  const response = await fetch(`https://api.mhbstore.com/api/ads/${id}`, {
    method: "PATCH",
    body: formData,
  });
  const data = await response.json();
  return data;
});

// Async thunk to delete an ad
export const deleteAd = createAsyncThunk("ads/deleteAd", async (id) => {
  const response = await fetch(`https://api.mhbstore.com/api/ads/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
});

const adsCenterSlice = createSlice({
  name: "adsCenter",
  initialState: {
    adsData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.adsData = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.loading = false;
        state.adsData.push(action.payload); // Add newly created ad to the state
      })
      .addCase(createAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        // Handle ad by id
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        // Handle update logic here
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        // Handle deletion logic here
      });
  },
});

export default adsCenterSlice.reducer;
