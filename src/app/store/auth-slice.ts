import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from "@clerk/backend";

// TODO: add auth state management instead of cookie storage
interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; username: string }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.username;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
