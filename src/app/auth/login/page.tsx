import React from 'react';
import {DemoLogin} from "@/app/components/DemoLogin";
import {AuthFlows} from "@/interface/types";
import {ClerkLogin} from "@/app/components/ClerkLogin";

export default async function LoginPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
const demoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${searchParams.authFlow || AuthFlows.DEMO}`;

    const demoTodoList = await fetch(demoApiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            console.log(res);
            const response = res.json();
            // console.log(response);
            return response
        })
        .catch(err => {
            console.error('Failed to fetch demo user list', err);
            return [];
        });

    console.log(demoTodoList);

    const demoUserList: string[] = demoTodoList.map((todo: any) => todo.userId);

    const authFlow = searchParams.authFlow || AuthFlows.DEMO;
    return (
        <>
            {authFlow === AuthFlows.DEMO ?
                <DemoLogin users={demoUserList} />
                :
                <ClerkLogin/>
            }
        </>
    );
}