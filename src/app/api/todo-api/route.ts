import axios from 'axios';
import {AuthFlows, TodoItem} from '@/interface/types';
import {NextRequest, NextResponse} from "next/server";

const environment = process.env.ENVIRONMENT;

const todoApiUrl = environment === AuthFlows.DEMO
    ? process.env.MOCK_DATA_API_URL
    : process.env.CHRONICLE_API_GATEWAY;

const getTodoData = async (req: Request): Promise<TodoItem[]> => {
    try {
        const {userId} = new URL(req.url).searchParams;
        const url = userId ? `${todoApiUrl}/user/${userId}/todos/` : `${todoApiUrl}/todos`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch todos');
    }
};

const createTodoData = async (content: TodoItem): Promise<TodoItem> => {
    if(environment === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.post(`${todoApiUrl}/todos`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create todo');
    }
};

const saveTodoData = async (content: TodoItem): Promise<TodoItem> => {
    if(environment === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.put(`${todoApiUrl}/todos/${content.id}`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update todo');
    }
};

const deleteTodoData = async (id: string | string[] | undefined): Promise<void> => {
    if(environment === AuthFlows.DEMO) {
        return;
    }
    try {
        await axios.delete(`${todoApiUrl}/todos/${id}`);
    } catch (error) {
        throw new Error('Failed to delete todo');
    }
};

export async function GET(request: NextRequest) {
    const todos = await getTodoData(request);
    return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
    const content = await request.json();
    if (!content) {
        return NextResponse.json({error: 'Content is required'});
    }
    const newTodoData = await createTodoData(content);
    return NextResponse.json(newTodoData);
}

export async function PUT(request: NextRequest) {
    const content = await request.json();
    if (!content || !content.id) {
        return NextResponse.json({error: 'Content is required'});
    }
    const updatedTodoData = await saveTodoData(content);
    return NextResponse.json(updatedTodoData);
}

export async function DELETE(request: NextRequest) {
    const {id} = new URL(request.url).searchParams;
    if (!id) {
        return NextResponse.json({error: 'ID is required for deletion'});
    }
    await deleteTodoData(id);
    return NextResponse.json({success: true});

}

