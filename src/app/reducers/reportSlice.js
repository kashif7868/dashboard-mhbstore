import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk to fetch the report data
export const fetchReport = createAsyncThunk('report/fetchReport', async () => {
  const response = await fetch('http://localhost:8000/api/reports');
  const data = await response.json();
  return data;
});

// Asynchronous thunk to update the report data
export const updateReport = createAsyncThunk('report/updateReport', async (reportData) => {
  const response = await fetch('http://localhost:8000/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });
  const data = await response.json();
  return data;
});

// Initial state
const initialState = {
  report: null,
  status: 'idle',
  error: null,
};

// Create the reportSlice
const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the reducers and actions
export default reportSlice.reducer;
