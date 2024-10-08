import React from 'react';
import {AuthFlows, TodoItem} from '@/interface/types';
import {cookies} from 'next/headers';
import Image from "next/image";
import {TodoListContainer} from '@/app/components/TodoListContainer';
import {redirect} from 'next/navigation';
import {LogoutButton} from "@/app/components/LogoutButton";
import {DemoModeButton} from "@/app/components/DemoModeButton";
import {TodoListProviderContext} from "@/app/components/TodoListProviderContext";
import {LogInfo} from "@/app/api/api-utils/log-utils";
import warningSvg from '../../assets/images/construction-danger-exclamantion.svg';
import {AUTH_API_URL, BASE_URL, LOGIN_PATH, TODO_API_URL} from "@/app/constants";

export default async function TodoPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {

    // Access the cookies using Next.js cookies utility
    const cookieStore = cookies();
    const authToken = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token')?.value;

    const flow = searchParams.flow || AuthFlows.DEMO;
    const authUrl = BASE_URL.concat(AUTH_API_URL.replace(':flow', flow)).concat('&token=').concat(authToken || '');
    const loginUrl = LOGIN_PATH.replace(':flow', flow).replace(':redirectPath', '/todo');



    // Temporary placeholder for non-demo flows
    if (flow !== AuthFlows.DEMO) {
        return (
            <div
                className="h-screen bg-darkGreen rounded-lg w-full text-center align-middle justify-center h-full flex flex-col items-center m-5">
                <Image src={warningSvg} alt="logo" width={200} height={200}/>
                <h1 className="text-2xl font-bold">This feature is not available just yet</h1>
                <DemoModeButton/>
            </div>
        );
    }

    // Fail fast if no auth token is found
    if (!authToken) {
        LogInfo('No auth token found in cookies, redirecting user to login page: ' + loginUrl);
        redirect(loginUrl);  // Redirect to the login page
    }

    // Check auth status with the backend
    const checkAuthStatus = async () => {
        const response = await fetch(authUrl);
        const responseData = await response.json();
        return responseData.success;
    };

    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
        LogInfo('Auth token not valid, redirecting user to login page');
        redirect(loginUrl);
    }

    // Fetch todo data for the authenticated user
    const fetchTodoData = async () => {
        const todoUrl = BASE_URL.concat(TODO_API_URL.replace(':flow', flow));
        const response = await fetch(todoUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return await response.json();
    };

    let todos: TodoItem[] = await fetchTodoData( );

    if(flow === AuthFlows.DEMO) {
        todos = todos.map(todo => ({...todo, description: `This task belongs to demo user ${todo.userId}`}));
    }

    return (
        <>
            <div
                className="h-auto sm:h-[90vh] m-4 bg-darkGreen rounded-lg w-full text-center grid grid-cols-4 grid-rows-5 gap-4 p-4 text-white">
                <header
                    className="h-[17vh]  col-span-4 row-span-1 bg-black p-8 text-center rounded-lg grid grid-cols-10 grid-rows-2">
                    <h1 className="col-span-10 row-span-1 text-3xl sm:text-6xl font-bold">My To-Do List</h1>
                    <LogoutButton flow={flow} redirectPath="/todo"/>
                </header>
                <div className="h-[150vh] sm:h-[70vh] w-full col-span-4 row-span-5 p-5">
                    <TodoListProviderContext>
                        <TodoListContainer initialTodos={todos}/>
                    </TodoListProviderContext>
                </div>
            </div>
        </>
    );
}
