import React from 'react';
import { DemoLogin } from "@/app/components/DemoLogin";
import { AuthFlows, TodoItem } from "@/interface/types";
import { ClerkLogin } from "@/app/components/ClerkLogin";
import { LogError, LogInfo } from "@/app/api/api-utils/log-utils";
import {BASE_URL, LOGIN_PATH, TODO_API_URL} from "@/app/constants";

export default async function LoginPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const authFlow = searchParams.flow || AuthFlows.DEMO;
    const redirectPath = searchParams.redirectPath || '';
    const demoApiUrl = BASE_URL.concat(TODO_API_URL.replace(':flow', authFlow));

    // Initialize userSet
    const userSet = new Set<number>();

    try {
        // Fetch the demo user list
        const demoTodoList = await fetch(demoApiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json());

        // Handle potential error in the fetched data
        if (demoTodoList.error) {
            throw new Error(demoTodoList.error);
        }

        // Add users to the set
        demoTodoList.forEach((todo: TodoItem) => userSet.add(Number(todo.userId)));
        LogInfo(`Fetched demo users: ${userSet.size}`);
    } catch (error) {
        // Log error and provide user feedback if needed
        LogError((error as Error).message, 'LoginPage', error as Error);
        return <p>Failed to load demo users. Please try again later.</p>;
    }

    // Conditional rendering based on authFlow and userSet
    return (
        <>
            {authFlow === AuthFlows.DEMO ? (
                <DemoLogin users={userSet} authFlow={authFlow} originPath={redirectPath} />
            ) : (
                <ClerkLogin />
            )}
        </>
    );
}
