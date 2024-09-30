import React from 'react';
import {AuthFlows, TodoItem} from '@/interface/types';
import {cookies} from 'next/headers';
import {TodoListContainer} from '@/app/components/TodoListContainer';
import {redirect} from 'next/navigation';
import {LogoutButton} from "@/app/components/LogoutButton";
import {DemoModeButton} from "@/app/components/DemoModeButton";
import {TodoListProviderContext} from "@/app/components/TodoListProviderContext";

export default async function TodoPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
    const flow = searchParams.flow || AuthFlows.DEMO;
    const loginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?flow=${flow}`;

    // Access the cookies using Next.js cookies utility
    const cookieStore = cookies();
    const authToken = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token')?.value;

    // Temporary fast fail for non-demo flows
    if (flow !== AuthFlows.DEMO) {
        return (
            <div
                className="h-screen bg-darkGreen rounded-lg w-full text-center align-middle justify-center h-full flex flex-col items-center">
                <h1 className="text-2xl font-bold">This feature is not available in this flow</h1>
                <DemoModeButton/>
            </div>
        );
    }

    // Fail fast if no auth token is found
    if (!authToken) {
        redirect(loginUrl);  // Redirect to the login page
        return null;
    }

    // Check auth status with the backend
    const checkAuthStatus = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?token=${authToken}`);
        const responseData = await response.json();
        return responseData.success;
    };

    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
        redirect(loginUrl);  // Redirect if not authenticated
        return null;
    }

    // Fetch Todo data for the authenticated user
    const fetchTodoData = async () => {
        const todoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${flow}`;
        const response = await fetch(todoUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return await response.json();
    };

    const todos: TodoItem[] = await fetchTodoData();

    return (
        <>
            <div
                className="h-screen bg-darkGreen rounded-lg w-full text-center grid grid-cols-4 grid-rows-5 gap-4 p-4 text-white">
                <header
                    className="col-span-4 row-span-1 bg-black p-5 text-center rounded-lg grid grid-cols-10 grid-rows-2">
                    <h1 className="col-span-10 row-span-1 text-6xl font-bold">My To-Do List</h1>
                    <LogoutButton/>
                </header>
                <div className="col-span-4 row-span-5 p-5">
                    <TodoListProviderContext>
                        <TodoListContainer initialTodos={todos}/>
                    </TodoListProviderContext>
                </div>
            </div>
        </>
    );
}
