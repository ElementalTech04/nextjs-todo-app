'use client';

import {useRouter, useSearchParams} from 'next/navigation';  // Import redirect for server-side redirection
import React, {useEffect} from 'react';
import {TodoListContainer} from '@/app/components/TodoListContainer';
import {AuthFlows} from '@/interface/types';
import {getCookie, setCookie} from "cookies-next";
import {useDispatch, useSelector} from "react-redux";
import {reorderTasks, setTodos} from "@/app/store/todo-slice";
import logoutSvg from '@/assets/images/account-in-person-user-group-people.svg';
import Image from 'next/image';
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {RootState} from "@/app/store/store";


const todosSelector = (state: RootState) => state.todos

export default function TodoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const authFlow = searchParams.get('flow') || AuthFlows.DEMO
    const loginUrl = `/auth/login?authFlow=${authFlow}&originPath=/todo`;

    // Get JWT for backend authentication
    const authToken = getCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token') || "";

    // Fail fast if no auth token is found
    if (!authToken) {
        router.push(loginUrl);  // Redirect to the login page
    }

    // Fetch Todo data for the authenticated user
    const fetchTodoData = async () => {
        const todoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${authFlow}`;
        const response = await fetch(todoUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        return await response.json();

    }

    const checkAuthStatus = async () => {
        const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?token=${authToken}`)
        try {
            const responseData = await response.json();
            if (responseData.success) {
                return true;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const logout = () => {
        setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token', null);
        console.log("logout");
        router.replace(`/auth/login?flow=${AuthFlows.DEMO}`);
    }

    const handleOnDragStart = (result: { draggableId: string }) => {
        console.log("start drag", result);
    }

    const handleOnDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // If dropped outside of a droppable area, do nothing
        if (!destination) return;

        // Dispatch reorder action
        dispatch(reorderTasks({
            sourceIndex: source.index,
            destinationIndex: destination.index,
        }));
    };

    useEffect(() => {
        // when the UI refreshes, check authentication status and fetch todo data
        if (!checkAuthStatus()) {
            router.push(loginUrl);
        } else {
            fetchTodoData().then(response => {
                if (response) {
                    dispatch(setTodos(response));
                }
            });
        }
    }, [authToken]);

    //temporary fast fail for non-demo flows
    if (authFlow !== AuthFlows.DEMO) {
        return (
            <div
                className="h-screen bg-darkGreen rounded-lg w-full text-center align-middle justify-center h-full">
                <h1 className="text-2xl font-bold">This feature is not available in this flow. Go Back.</h1>
            </div>
        )
    }


    return (
        <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
            <div
                className="h-screen bg-darkGreen rounded-lg w-full text-center grid grid-cols-4 grid-rows-5 gap-4 p-4 text-white">

                <header
                    className="col-span-4 row-span-1 bg-black p-5 text-center rounded-lg grid grid-cols-10 grid-rows-2">
                    <h1 className="col-span-10 row-span-1 text-6xl font-bold">My To-Do List</h1>
                    <button
                        onClick={logout}
                        className="col-span-10 row-span-2 justify-self-end hover:scale-110 transition-all flex items-center flex-col">
                        <Image src={logoutSvg} alt="logout" width={35} height={35}/>
                        <p>Logout</p>
                    </button>
                </header>
                <section className="col-start-1 col-end-3 row-span-4 bg-black p-4 rounded-lg">
                    <h1 className="text-3xl align-left font-bold">In Progress</h1>
                    <hr className="my-4 border-gray-300"/>
                    <TodoListContainer isCompletedList={false}/>
                </section>
                <section className="col-start-3 col-end-5 row-span-4 bg-black p-4 rounded-lg">
                    <h1 className="text-3xl align-left font-bold">Completed</h1>
                    <hr className="my-4 border-gray-300"/>
                    <TodoListContainer isCompletedList={true}/>
                </section>
            </div>
        </DragDropContext>

    );
}
