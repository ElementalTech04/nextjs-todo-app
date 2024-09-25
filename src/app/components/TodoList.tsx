

export const TodoList = ({ todos }: { todos: any }) => {

    console.log(todos)
    return (
        <div className="text-white">
            {todos.length > 0 ? todos.map((todo, index) => (
                <div key={index}>
                    <TodoItem todo={todo} />
                </div>
            )):
                <div>No todos found</div>
            }
        </div>
    )
}