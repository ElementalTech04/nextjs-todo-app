import React from 'react';
import {DemoLogin} from "@/app/components/DemoLogin";
import {AuthFlows, TodoItem} from "@/interface/types";
import {ClerkLogin} from "@/app/components/ClerkLogin";
import {LogError, LogInfo} from "@/app/api/api-utils/log-utils";

export default async function LoginPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
    const demoApiUrl = `/api/todo-api?flow=${searchParams.authFlow || AuthFlows.DEMO}`;
    const userSet = new Set<number>();
    const authFlow = searchParams.authFlow || AuthFlows.DEMO;
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

    LogInfo(`Fetched demo users: ${demoTodoList.length}`);
    demoTodoList.forEach((todo: TodoItem) => userSet.add(Number(todo.userId)));

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