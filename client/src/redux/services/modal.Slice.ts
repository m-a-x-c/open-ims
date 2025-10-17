import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  bulkDelete: string[];
}

const initialState: InitialState = {
  bulkDelete: []
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {}
});

export default modalSlice.reducer;
