import {UIType} from "@/utils/types";
import {createSlice} from "@reduxjs/toolkit";

const initialState: UIType = {
  darkMode: true,
  toShowOptions: null,
  toShowReactions: null,
  showContactInfo: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setToShowReactions: (state, action) => {
      state.toShowReactions = action.payload;
    },
    setToShowOptions: (state, action) => {
      state.toShowOptions = action.payload;
    },
    setShowContactInfo: (state, action) => {
      state.showContactInfo = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setToShowReactions,
  setToShowOptions,
  setShowContactInfo,
} = uiSlice.actions;
export const selectDarkMode = (state: { ui: UIType }) => state.ui.darkMode;
export const selectShowOptions = (state: { ui: UIType }) => state.ui.toShowOptions;
export const selectShowReactions = (state: { ui: UIType }) => state.ui.toShowReactions;
export const selectShowContactInfo = (state: { ui: UIType }) => state.ui.showContactInfo;

export default uiSlice.reducer;
