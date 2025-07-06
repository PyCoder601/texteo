import {ConversationState} from "@/utils/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "@/service/api";
import {AxiosResponse} from "axios";

const initialState: ConversationState = {
    conversations: [],
    currentConversation: null,
}

export const fetchConversations = createAsyncThunk(
    'conversation/fetchConversations',
    async () => {
        const response: AxiosResponse = await api.get('conversations/')
        return response.data
    },
)

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        setConversations: (state, action) => {
            state.conversations = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.conversations = []
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.conversations = action.payload
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.conversations = []
            })
    },
})

export const {setCurrentConversation, setConversations} = conversationSlice.actions;
export default conversationSlice.reducer;

export const selectConversations = (state:
                                    { conversation: ConversationState }) => state.conversation.conversations;
export const selectCurrentConversation = (state: {
    conversation: ConversationState
}) =>
    state.conversation.currentConversation;