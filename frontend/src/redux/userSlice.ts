import {UserDataType, UserState} from "@/utils/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: UserState = {
    user: null,
    currFriend: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDataType>) => {
            state.user = action.payload;
        },
        setCurrFriend: (state, action: PayloadAction<UserDataType>) => {
            state.currFriend = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        },
        setCurrFriendStatus: (state, action) => {
            if (state.currFriend) {
                state.currFriend.is_online = action.payload.status
                if (action.payload.status === false)
                    state.currFriend.last_seen = action.payload.last_seen
            }
        }
    },
})

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectCurrFriend = (state: { user: UserState }) => state.user.currFriend;

export const {setUser, setCurrFriend, logoutUser, setCurrFriendStatus} = userSlice.actions;

export default userSlice.reducer;