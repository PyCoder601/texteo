import {UserDataType, UserState} from "@/utils/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: UserState = {
    user: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<UserDataType>) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        },
    },
})

export const selectUser = (state: { user: UserState }) => state.user.user;

export const {loginUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;