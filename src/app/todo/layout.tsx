'use client';

import React from "react";
import TodoProvider from "@/app/components/TodoProvider";

export default function TodoLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <TodoProvider>
                <main className="p-2 min-h-screen flex items-center justify-center">
                    {children}
                </main>
            </TodoProvider>
        </>
    );
}
