'use client';
import {TodoItem} from "@/interface/types";
import {useEffect, useState} from "react";
import {Draggable} from "react-beautiful-dnd";

export default function TodoListItem({todoItem: todoItem, index: index}: { todoItem: TodoItem, index: number }) {

    // Determine the circle color based on the priority level
    const getPriorityColor = () => {
        switch (todoItem?.priority) {
            case 1:
                return 'bg-red';  // High priority (Red)
            case 2:
                return 'bg-yellow';  // Medium priority (Yellow)
            case 3:
                return 'bg-green-500';  // Low priority (Green)
            default:
                return 'border-2 border-gray-400';  // No priority (Outline)
        }
    };

    return (
        <Draggable draggableId={String(todoItem?.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    className="grid grid-cols-4 grid-rows-4 space-x-4 bg-white p-3 rounded-lg shadow-md mb-4 text-black">
                    {/* Priority Icon (circle) */}
                    <div className={`col-span-1 row-span-1 h-8 w-8 rounded-full ${getPriorityColor()}`}/>

                    {/* Task Information */}
                    <div className="col-start-2 col-end-4 row-span-2 flex-grow">
                        <h3 className="text-2xl font-bold">{todoItem?.title}</h3>
                        <p className="text-gray-600">{todoItem?.description}</p>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
