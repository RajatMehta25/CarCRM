import { createSlice } from "@reduxjs/toolkit";

export const NavigationSlice = createSlice({
  name: "navigate",
  initialState: {
    value: 0,
    driverObjectId: "",
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = NavigationSlice.actions;

export default NavigationSlice.reducer;

export const getDriverObjectid = (state) => state.navigate.driverObjectId;
