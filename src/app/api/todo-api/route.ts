import axios from 'axios';
import {AuthFlows, TodoItem} from '@/interface/types';
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";


const todoApiUrl = (flow: string) => flow === AuthFlows.DEMO
    ? process.env.MOCK_DATA_API_URL
    : process.env.CHRONICLE_API_GATEWAY;

const getTodoData = async (authHeader: string, flow: string): Promise<TodoItem[]> => {
    try {
        const authToken: string =authHeader?.split(' ')[1] || '';
        const tokenDetails: any = jwt.decode(authToken);
        const apiUrl = todoApiUrl(flow);
        const userId = tokenDetails?.username;
        const url = userId ? `${apiUrl}/user/${userId}/todos/` : `${apiUrl}/todos`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch todos');
    }
};

const createTodoData = async (content: TodoItem, flow: string): Promise<TodoItem> => {
    if(flow === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.post(`${todoApiUrl}/todos`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create todo');
    }
};

const saveTodoData = async (content: TodoItem, flow: string): Promise<TodoItem> => {
    if(flow === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.put(`${todoApiUrl}/todos/${content.id}`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update todo');
    }
};

const deleteTodoData = async (id: string | string[] | undefined, flow: string): Promise<void> => {
    if(flow === AuthFlows.DEMO) {
        return;
    }
    try {
        await axios.delete(`${todoApiUrl}/todos/${id}`);
    } catch (error) {
        throw new Error('Failed to delete todo');
    }
};

export async function GET(request: NextRequest) {
    const todos = await getTodoData(request.headers.get('Authorization') || '', new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
    const content = await request.json();
    if (!content) {
        return NextResponse.json({error: 'Content is required'});
    }
    const newTodoData = await createTodoData(content, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    return NextResponse.json(newTodoData);
}

export async function PUT(request: NextRequest) {
    const content = await request.json();
    if (!content || !content.id) {
        return NextResponse.json({error: 'Content is required'});
    }
    const updatedTodoData = await saveTodoData(content, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    return NextResponse.json(updatedTodoData);
}

export async function DELETE(request: NextRequest) {
    const content = await request.json();
    if (!content || !content.id) {
        return NextResponse.json({error: 'ID is required for deletion'});
    }
    await deleteTodoData(content.id, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    return NextResponse.json({success: true});

}

