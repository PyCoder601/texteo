import {ConversationState} from "@/utils/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "@/service/api";
import {AxiosResponse} from "axios";

const initialState: ConversationState = {
    conversations: [],
    currentConversation: null,
    messages: []
}

export const fetchConversations = createAsyncThunk(
    'conversation/fetchConversations',
    async () => {
        const response: AxiosResponse = await api.get('conversations/')
        return response.data
    },
)

export const fetchMessages = createAsyncThunk(
    'conversation/fetchMessages',
    async (conversationId: number) => {
        const response: AxiosResponse = await api.get(`conversations/${conversationId}/messages/`)
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
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        deleteMessage: (state, action) => {
            const index = state.messages.findIndex(message => message.id === action.payload)
            state.messages.splice(index, 1)
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
            .addCase(fetchMessages.pending, (state) => {
                state.messages = []
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.messages = []
            })
    },
})

export const {setCurrentConversation, setConversations, addMessage, deleteMessage} = conversationSlice.actions;
export default conversationSlice.reducer;

export const selectConversations = (state:
                                    { conversation: ConversationState }) => state.conversation.conversations;
export const selectCurrentConversation = (state: {
    conversation: ConversationState
}) =>
    state.conversation.currentConversation;

export const selectMessages = (state: { conversation: ConversationState }) => state.conversation.messages;