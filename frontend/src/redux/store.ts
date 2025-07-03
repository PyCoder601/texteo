import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import {Persistor} from "redux-persist/es/types";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice";
import storageSession from "redux-persist/lib/storage/session";

const rootReducer = combineReducers({
    ui: uiReducer,
    user: userReducer,
    conversation: conversationReducer
});

const persistConfig = {
    key: "root",
    storage: storageSession,
    whitelist: ["ui", "user", "conversation"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor: Persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
