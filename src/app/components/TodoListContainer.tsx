'use client';


import {useDispatch} from "react-redux";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {TodoList} from "@/app/components/TodoList";
import React, {useEffect} from "react";
import {TodoItem} from "@/interface/types";
import {reorderTasks, setTodos, toggleTodo} from "@/app/store/todo-slice";


export const TodoListContainer = ({initialTodos: initialTodos}: { initialTodos: TodoItem[] }) => {
    const dispatch = useDispatch();

    const handleOnDragStart = (result: { draggableId: string }) => {
        console.log("start drag", result);
    }

    const handleOnDragEnd = (result: DropResult) => {
        const {source, destination, draggableId} = result;

        console.log("end drag", result);

        // If dropped outside a droppable area, do nothing
        if (!destination) return;

        if (destination.droppableId !== source.droppableId) {
            dispatch(toggleTodo(draggableId));
             console.log("dispatch");
        }

        // Dispatch reorder action
        dispatch(reorderTasks({
            sourceIndex: source.index,
            destinationIndex: destination.index,
        }));
    };

    useEffect(() => {
        if (initialTodos) {
            dispatch(setTodos(initialTodos));
        }
    }, [dispatch, initialTodos]);

    return (
        <>
            <div className="flex flex-wrap justify-between h-[100%]">
                <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
                    <section className="bg-black p-4 rounded-lg w-[48%] h-[100%]">
                        <h1 className="text-3xl align-left font-bold">In Progress</h1>
                        <hr className="my-4 border-gray-300"/>
                        <TodoList isCompletedList={false}/>
                    </section>
                    <section className="bg-black p-4 rounded-lg w-[48%] h-[100%]">
                        <h1 className="text-3xl align-left font-bold">Completed</h1>
                        <hr className="my-4 border-gray-300"/>
                        <TodoList isCompletedList={true}/>
                    </section>
                </DragDropContext>
            </div>

        </>
    );
}