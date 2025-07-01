import {UserState} from "@/utils/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: UserState = {
    user: null,
    token: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<UserState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
        },
    },
})

export const {loginUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;