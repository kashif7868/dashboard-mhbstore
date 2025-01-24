import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  partners: [],
  partner: null, // Store the details of a single partner
  isLoading: false,
  error: null,
};

// Thunks for async actions
export const getAllPartners = createAsyncThunk('partners/getAll', async () => {
  const response = await axios.get('http://localhost:8000/api/partners');
  return response.data.data; // Assuming 'data' contains the list of partners
});

export const getPartnerById = createAsyncThunk('partners/getById', async (id) => {
  const response = await axios.get(`http://localhost:8000/api/partners/${id}`);
  return response.data; // Assuming the response contains the partner data
});

export const deletePartner = createAsyncThunk('partners/delete', async (id) => {
  await axios.delete(`http://localhost:8000/api/partners/${id}`);
  return id; // Return the id of the deleted partner
});

const partnerSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPartners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPartners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partners = action.payload;
      })
      .addCase(getAllPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getPartnerById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPartnerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partner = action.payload; // Store the fetched partner details in the state
      })
      .addCase(getPartnerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.partners = state.partners.filter((partner) => partner._id !== action.payload);
      });
  },
});

export default partnerSlice.reducer;
