import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: 0,
  data: {},
  error: '',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    setFormData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = '';
    },
    clearFormData: (state) => {
        state.data = {
          name: {},
          wheels: null,
          vehicleType: null,
          model: null,
          dateRange: {},
        };
        state.currentQuestion = 0; // Reset question index if needed
        state.error = null; // Clear any previous error
      },
  },
});

export const { setCurrentQuestion, setFormData, setError, clearError,clearFormData } = formSlice.actions;

export default formSlice.reducer;
