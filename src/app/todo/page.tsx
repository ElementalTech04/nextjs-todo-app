import React from "react";
import {TodoList} from "@/app/components/TodoList";

export default async function TodoPage() {
    const initialTodoData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-service`).then(res => res.json()).catch(err => console.error(err));

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