import { redirect } from 'next/navigation';  // Import redirect for server-side redirection
import React from 'react';
import { TodoList } from '@/app/components/TodoList';
import { AuthFlows } from '@/interface/types';
import {cookies} from "next/headers";

export default async function TodoPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

    const authFlow = searchParams.flow || AuthFlows.DEMO;
    const allCookies = cookies();

    const authToken = allCookies.get('tok-a-sym') || "";

    // Step 1: Check if the user is authenticated
    const isAuthenticated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?flow=${authFlow}&token=${authToken}`)
        .then(res => res.json())
        .catch(err => {
            console.error('Authentication failed', err);
            return null;
        });
    console.log(isAuthenticated);

    // Redirect to login page if not authenticated
    if (!isAuthenticated || !isAuthenticated.success) {
        redirect(`/auth/login?authFlow=${authFlow}`);  // Redirect to the login page
    }

    // Step 2: Fetch Todo data for the authenticated user
    const todoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${authFlow}`;
    const initialTodoData = await fetch(todoUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .catch(err => {
            console.error('Failed to fetch Todo data', err);
            return [];  // Return empty array if fetching fails
        });

    // Step 3: Render the Header, Todo list, and Completed Todo list
    return (
        <div className="h-screen bg-gray-700 rounded-lg w-full text-center p-24 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-4">
            <div></div>
            <div>
                <TodoList todos={initialTodoData || []} />  {/* Display the Todo List */}
            </div>
            <div></div>
        </div>
    );
}
