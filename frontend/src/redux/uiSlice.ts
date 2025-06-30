import {UIType} from "../../utils/types";
import {createSlice} from "@reduxjs/toolkit";

const initialState: UIType = {
    darkMode: true,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
    },
});

export const {toggleDarkMode} = uiSlice.actions;
export const selectDarkMode = (state: { ui: UIType }) => state.ui.darkMode;

export default uiSlice.reducer;
