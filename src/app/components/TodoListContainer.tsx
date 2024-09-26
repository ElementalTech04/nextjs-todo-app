'use client';

import React, {useEffect, useState} from "react";
import TodoListItem from "@/app/components/TodoListItem";
import {TodoItem,} from "@/interface/types";
import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store/store";

export const TodoListContainer = ({isCompletedList: isCompletedList, droppableId: droppableId}: {
    isCompletedList: boolean,
    droppableId: string
}) => {
    const todos: TodoItem[] = useSelector((state: RootState) => state.todos.todos);

    useEffect(() => {
        todos?.filter((todo: TodoItem) => todo.completed === isCompletedList)
    }, [isCompletedList, droppableId]);

    return (
        <>
            <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="w-full p-4 shadow-md h-[80%] overflow-y-scroll no-scrollbar">
                        {todos.length > 0 ? todos.map((todo: TodoItem, index: number) => (
                                <div key={index}>
                                    <TodoListItem todoItem={todo} index={index}/>
                                </div>
                            ))
                            :
                            <div>No todos found</div>
                        }
                    </div>
                )}
            </Droppable>
        </>
    )
}