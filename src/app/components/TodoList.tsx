import {TodoListItem} from "@/app/components/TodoListItem";


export const TodoList = ({ todos }: { todos: any }) => {

    return (
        <div className="text-white">
            {todos.length > 0 ? todos.map((todo, index) => (
                <div key={index}>
                    <TodoListItem todo={todo} />
                </div>
            )):
                <div>No todos found</div>
            }
        </div>
    )
}