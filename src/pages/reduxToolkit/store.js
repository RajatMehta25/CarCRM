import { configureStore } from "@reduxjs/toolkit";
import NavigationSlice from "./NavigationSlice";
const store = configureStore({
  reducer: {
    navigation: NavigationSlice,
  },
});
