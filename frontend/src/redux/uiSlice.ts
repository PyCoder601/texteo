import {UIType} from "@/utils/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface NotificationState {
  type_event: "success" | "error" | "info";
  titre: string;
  message: string;
}

const initialState: UIType = {
  darkMode: true,
  toShowOptions: null,
  toShowReactions: null,
  showContactInfo: false,
  notification: null,
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
    setNotification: (state, action: PayloadAction<NotificationState | null>) => {
      state.notification = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setToShowReactions,
  setToShowOptions,
  setShowContactInfo,
  setNotification,
} = uiSlice.actions;
export const selectDarkMode = (state: { ui: UIType }) => state.ui.darkMode;
export const selectShowOptions = (state: { ui: UIType }) => state.ui.toShowOptions;
export const selectShowReactions = (state: { ui: UIType }) => state.ui.toShowReactions;
export const selectShowContactInfo = (state: { ui: UIType }) => state.ui.showContactInfo;
export const selectNotification = (state: { ui: UIType }) => state.ui.notification;

export default uiSlice.reducer;
