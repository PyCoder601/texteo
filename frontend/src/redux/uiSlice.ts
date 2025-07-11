import {UIType} from "@/utils/types";
import {createSlice} from "@reduxjs/toolkit";

const initialState: UIType = {
    darkMode: true,
    toShowOptions: null,
    toShowReactions: null,
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
    },
});

export const {
    toggleDarkMode,
    setToShowReactions,
    setToShowOptions,
} = uiSlice.actions;
export const selectDarkMode = (state: { ui: UIType }) => state.ui.darkMode;
export const selectShowOptions = (state: { ui: UIType }) => state.ui.toShowOptions;
export const selectShowReactions = (state: { ui: UIType }) => state.ui.toShowReactions;

export default uiSlice.reducer;
