'use client';

import React from "react";
import TodoProvider from "@/app/components/TodoProvider";

export const TodoListProviderContext = ({children: children}: { children: React.ReactNode }) => {
    return (
        <TodoProvider>
            {children}
        </TodoProvider>
    )
}