import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medication } from '@/types/models';

interface MedicationState {
  list: Medication[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  list: [],
  isLoading: false,
  error: null,
};

export const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.list = action.payload;
    },
    addMedication: (state, action: PayloadAction<Medication>) => {
      state.list.push(action.payload);
    },
    updateMedication: (state, action: PayloadAction<Medication>) => {
      const index = state.list.findIndex(m => m.medId === action.payload.medId);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeMedication: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(m => m.medId !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMedications,
  addMedication,
  updateMedication,
  removeMedication,
  setLoading,
  setError,
} = medicationSlice.actions;
export default medicationSlice.reducer;