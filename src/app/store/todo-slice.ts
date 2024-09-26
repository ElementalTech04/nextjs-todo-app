import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TodoItem, TodoState} from "@/interface/types";

const initialState: TodoState = {
    todos: [],
    completedCount: 0,
    incompleteCount: 0,
    loading: false,
    error: null,
};


const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoItem>) => {
            state.todos.push({ ...action.payload, completed: false });
        },
        setTodos: (state, action: PayloadAction<TodoItem[]>) => {
            state.todos = action.payload
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((todo) => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        reorderTasks: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
            const { sourceIndex, destinationIndex } = action.payload;
            const [movedTask] = state.todos.splice(sourceIndex, 1);
            state.todos.splice(destinationIndex, 0, movedTask);
        },
        updateTodo: (state, action) => {
            const index = state.todos.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) {
                state.todos[index] = {
                    ...state.todos[index],
                    ...action.payload,
                };
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        },
    },
});

export const { addTodo, setTodos, toggleTodo,
    reorderTasks,updateTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
