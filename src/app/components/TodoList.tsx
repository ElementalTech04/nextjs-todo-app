

export const TodoList = ({ todos }: { todos: any }) => {

    console.log(todos)
    return (
        <div>
            {todos.length > 0 ? todos.map((todo, index) => (
                <div key={index}>
                    {todo.title}
                </div>
            )):
                <div>No todos found</div>
            }
        </div>
    )
}