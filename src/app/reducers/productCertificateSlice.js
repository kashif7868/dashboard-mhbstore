import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const apiUrl = 'https://api.mhbstore.com/api/certificates';

// Initial state for the slice
const initialState = {
  certificates: [],
  certificate: null,
  loading: false,
  error: null,
};

// Async thunk to fetch all certificates
export const getCertificates = createAsyncThunk('certificates/getCertificates', async () => {
  const response = await axios.get(apiUrl);
  return response.data.data;
});

// Async thunk to fetch certificate by ID
export const getCertificateById = createAsyncThunk('certificates/getCertificateById', async (id) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response.data.data;
});

// Async thunk to create a new certificate
export const createCertificate = createAsyncThunk('certificates/createCertificate', async (certificateData) => {
  const response = await axios.post(apiUrl, certificateData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
});

// Async thunk to update a certificate
export const updateCertificate = createAsyncThunk('certificates/updateCertificate', async ({ id, certificateData }) => {
  const response = await axios.patch(`${apiUrl}/${id}`, certificateData);
  return response.data.data;
});

// Async thunk to delete a certificate
export const deleteCertificate = createAsyncThunk('certificates/deleteCertificate', async (id) => {
  await axios.delete(`${apiUrl}/${id}`);
  return id;
});

// Create the slice
const productCertificateSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all certificates
      .addCase(getCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(getCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get certificate by ID
      .addCase(getCertificateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificateById.fulfilled, (state, action) => {
        state.loading = false;
        state.certificate = action.payload;
      })
      .addCase(getCertificateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create a new certificate
      .addCase(createCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates.push(action.payload);
      })
      .addCase(createCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update a certificate
      .addCase(updateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.certificates.findIndex(cert => cert._id === action.payload._id);
        if (index >= 0) {
          state.certificates[index] = action.payload;
        }
      })
      .addCase(updateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete a certificate
      .addCase(deleteCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = state.certificates.filter(cert => cert._id !== action.payload);
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export default productCertificateSlice.reducer;
