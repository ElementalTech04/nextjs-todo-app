import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TodoItem, TodoState} from "@/interface/types";

const initialState: TodoState = {
    todos: [],
    completedCount: 0,
    incompleteCount: 0,
    loading: false,
    error: null,
};

// Utility method to update object with differences between two objects
const updateObjectWithDifferences = (objA: any, objB: any) => {
    for (const key in objB) {
        if (objB.hasOwnProperty(key)) {
            if (typeof objB[key] === 'object' && !Array.isArray(objB[key]) && objB[key] !== null) {
                // If the property is an object, perform deep merge
                objA[key] = updateObjectWithDifferences(objA[key] || {}, objB[key]);
            } else if (objA[key] !== objB[key]) {
                // Update objA if values are different or if the key doesn't exist in objA
                objA[key] = objB[key];
            }
        }
    }
    return objA;
}

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
        modifyTodo: (state, action: PayloadAction<TodoItem>) => {
            const todo = state.todos.find((todo: TodoItem) => todo.id === action.payload.id);
            if (todo) {
                 updateObjectWithDifferences(todo, action.payload);
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        },
    },
});

export const { addTodo, setTodos, toggleTodo,
    reorderTasks,modifyTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
