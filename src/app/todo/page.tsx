import React from "react";
import {TodoList} from "@/app/components/TodoList";
import {AuthFlows} from "@/interface/types";

export default async function TodoPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {

    const authFlow = searchParams.flow || AuthFlows.DEMO;

    const initialTodoData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-service?flow=${authFlow}`).then(res => res.json()).catch(err => console.error(err));

    return (
        <>
            <div>
                <div>

                </div>
                <div>
                    <TodoList todos={initialTodoData || []} />
                </div>
                <div>

                </div>
            </div>
        </>
    );
}