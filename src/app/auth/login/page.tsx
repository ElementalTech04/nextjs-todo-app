import React from 'react';
import {DemoLogin} from "@/app/components/DemoLogin";
import {AuthFlows, TodoItem} from "@/interface/types";
import {ClerkLogin} from "@/app/components/ClerkLogin";

export default async function LoginPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
    const demoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${searchParams.authFlow || AuthFlows.DEMO}`;
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