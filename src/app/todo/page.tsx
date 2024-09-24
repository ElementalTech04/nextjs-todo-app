import React from "react";
import {TodoList} from "@/app/components/TodoList";
import {AuthFlows} from "@/interface/types";

export default async function TodoPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {

    const authFlow = searchParams.flow || AuthFlows.DEMO;

    const initialTodoData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-service?flow=${authFlow}`).then(res => res.json()).catch(err => console.error(err));

    return (
        <>
            <div className="h-screen bg-gray-700 rounded-lg w-full text-center p-24 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-4">
                <div>

                </div>
                <div>
                    <TodoList todos={initialTodoData || []}/>
                </div>
                <div>

                </div>
            </div>
        </>
    );
}