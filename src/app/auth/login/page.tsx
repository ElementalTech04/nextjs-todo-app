import React from 'react';
import {DemoLogin} from "@/app/components/DemoLogin";
import {AuthFlows, TodoItem} from "@/interface/types";
import {ClerkLogin} from "@/app/components/ClerkLogin";
import {LogError, LogInfo} from "@/app/api/api-utils/log-utils";

export default async function LoginPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
    const authFlow = searchParams.flow || AuthFlows.DEMO;
    const demoApiUrl = `/api/todo-api?flow=${authFlow}`;
    const userSet = new Set<number>();
    const originPath = searchParams.originPath || '';

    const demoTodoList = await fetch(demoApiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .catch(err => {
            console.error('Failed to fetch demo user list', err);
            return [];
        });

    if (demoTodoList.error) {
        LogError(demoTodoList.error, 'LoginPage', new Error(demoTodoList.error));
    }

    demoTodoList.forEach((todo: TodoItem) => userSet.add(Number(todo.userId)));
    LogInfo(`Fetched demo users: ${userSet.size}`);

    return (
        <>
            {authFlow === AuthFlows.DEMO ?
                <DemoLogin users={userSet} authFlow={authFlow} originPath={originPath} />
                :
                <ClerkLogin/>
            }
        </>
    );
}