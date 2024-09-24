import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";

const reducers = combineReducers({})

export const store = configureStore({
    reducer: reducers,
});

export type TodoAppState = ReturnType<typeof reducers>;
export type TodoAppDispatch = ReturnType<typeof reducers>;