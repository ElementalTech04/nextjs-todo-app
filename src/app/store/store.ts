// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import todoReducer from './todo-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        todos: todoReducer,
    },
});

// Export the store and root state type for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
