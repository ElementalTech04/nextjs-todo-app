import {redirect} from 'next/navigation';  // Import redirect for server-side redirection
import React from 'react';
import {TodoList} from '@/app/components/TodoList';
import {AuthFlows} from '@/interface/types';
import {cookies} from "next/headers";
import {getCookie} from "cookies-next";

export default async function TodoPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {

    const authFlow = searchParams.flow || AuthFlows.DEMO;
    const allCookies = cookies();
    const loginUrl = `/auth/login?authFlow=${authFlow}&originPath=/todo`;

    const authToken = allCookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY) || "";

    // Fail fast if no auth token is found
    if (!authToken) {
        redirect(loginUrl);  // Redirect to the login page
    }

    // Check if the user is authenticated
const isAuthenticated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?token=${authToken.value}`)
        .then(res => res.json())
        .catch(err => {
            console.error('Authentication failed', err);
            return null;
        });
    console.log(isAuthenticated);
    // Redirect to login page if not authenticated
    if (!isAuthenticated || !isAuthenticated.success) {
        redirect(loginUrl);
    }

    // Fetch Todo data for the authenticated user
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

    // Render the Header, Todo list, and Completed Todo list
    return (
        <div
            className="h-screen bg-gray-700 rounded-lg w-full text-center p-24 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-4">
            <div></div>
            <div>
                <TodoList todos={initialTodoData || []}/> {/* Display the Todo List */}
            </div>
            <div></div>
        </div>
    );
}
