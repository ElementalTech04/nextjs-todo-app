'use client';

import React, {useMemo} from "react";
import TodoListItem from "@/app/components/TodoListItem";
import {TodoItem,} from "@/interface/types";
import {Droppable} from "react-beautiful-dnd";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store/store";
import "../../styles/scroll.css";

const filterTodos = (todos: TodoItem[], isCompleted: boolean) => todos.filter((todo: TodoItem) => todo.completed === isCompleted)


export const TodoList = ({isCompletedList: isCompletedList}: {
    isCompletedList: boolean
}) => {
    const todos: TodoItem[] = useSelector((state: RootState) => state.todos.todos);

    const filteredTodos = useMemo(() => {
        return filterTodos(todos, isCompletedList);
    }, [todos, isCompletedList]);

    return (
        <>
            <Droppable droppableId={isCompletedList ? "completed" : "inProgress"}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="w-full p-4 shadow-md h-[80%] overflow-y-scroll no-scrollbar">
                        {
                            filteredTodos.map((todo: TodoItem, index: number) => (
                                <div key={index}>
                                    <TodoListItem todoItem={todo} index={index}/>
                                </div>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    )
}