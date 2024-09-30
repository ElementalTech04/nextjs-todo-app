import axios from 'axios';
import {AuthFlows, TodoItem} from '@/interface/types';
import {NextRequest, NextResponse} from "next/server";
import jwt, {JwtPayload} from "jsonwebtoken";
import {NextError} from "next/dist/lib/is-error";
import {LogError, LogInfo} from "@/app/api/api-utils/log-utils";


const todoApiUrl = (flow: string) => flow === AuthFlows.DEMO
    ? process.env.MOCK_DATA_API_URL
    : process.env.CHRONICLE_API_GATEWAY;

const getTodoData = async (authHeader: string, flow: string): Promise<TodoItem[]> => {
    LogInfo('Fetching todos');
    try {
        const authToken: string = authHeader?.split(' ')[1] || '';
        const tokenDetails: JwtPayload = <JwtPayload> jwt.decode(authToken);
        const apiUrl = todoApiUrl(flow);
        const userId = tokenDetails.username;
        const url = userId ? `${apiUrl}/user/${userId}/todos/` : `${apiUrl}/todos`;
        const response = await axios.get(url);
        LogInfo(`Successfully fetched todos for user ${userId}`);
        return response.data;
    } catch (error) {
        const errorMessage = 'Failed to fetch todos';
        LogError(errorMessage, flow, error as NextError);
        throw new Error(errorMessage.concat(`: ${error}`));
    }
};

const createTodoData = async (content: TodoItem, flow: string): Promise<TodoItem> => {
    if (flow === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.post(`${todoApiUrl}/todos`, content);
        LogInfo(`Successfully created todo ${content.id} for user ${content.userId}`);
        return response.data;
    } catch (error) {
        const errorMessage = 'Failed to create todo';
        LogError(errorMessage, flow, error as NextError);
        throw new Error(errorMessage.concat(`: ${error}`));
    }
};

const saveTodoData = async (content: TodoItem, flow: string): Promise<TodoItem> => {
    if (flow === AuthFlows.DEMO) {
        return content;
    }
    try {
        const response = await axios.put(`${todoApiUrl}/todos/${content.id}`, content);
        LogInfo(`Successfully saved todo ${content.id} for user ${content.userId}`);
        return response.data;
    } catch (error) {
        const errorMessage = 'Failed to save todo';
        LogError(errorMessage, flow, error as NextError);
        throw new Error(errorMessage.concat(`: ${error}`));
    }
};

const deleteTodoData = async (id: string | string[] | undefined, flow: string): Promise<void> => {
    if (flow === AuthFlows.DEMO) {
        return;
    }
    try {
        await axios.delete(`${todoApiUrl}/todos/${id}`);
        LogInfo(`Successfully deleted todo ${id}`);
    } catch (error) {
        const errorMessage = 'Failed to delete todo';
        LogError(errorMessage, flow, error as NextError);
        throw new Error(errorMessage.concat(`: ${error}`));
    }
};

export async function GET(request: NextRequest) {
    let todos: TodoItem[];
    try {
        todos = await getTodoData(request.headers.get('Authorization') || '', new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    } catch (error) {
        const errorObj: Error = error as Error;
        return NextResponse.json({error: errorObj.message});
    }
    return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
    const content = await request.json();

    if (!content) {
        return NextResponse.json({error: 'Content is required'});
    }

    let newTodoData: TodoItem;

    try {
        newTodoData = await createTodoData(content, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    } catch (error) {
        const errorObj: Error = error as Error;
        return NextResponse.json({error: errorObj.message});
    }

    return NextResponse.json(newTodoData);
}

export async function PUT(request: NextRequest) {
    const content = await request.json();

    if (!content || !content.id) {
        return NextResponse.json({error: 'Content is required'});
    }

    let updatedTodoData: TodoItem;

    try {
        updatedTodoData = await saveTodoData(content, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    } catch (error) {
        const errorObj: Error = error as Error;
        return NextResponse.json({error: errorObj.message});
    }

    return NextResponse.json(updatedTodoData);
}

export async function DELETE(request: NextRequest) {
    const content = await request.json();
    if (!content || !content.id) {
        return NextResponse.json({error: 'ID is required for deletion'});
    }
    try {
        await deleteTodoData(content.id, new URL(request.url).searchParams.get('flow') || AuthFlows.DEMO);
    } catch (error) {
        const errorObj: Error = error as Error;
        return NextResponse.json({error: errorObj.message});
    }
    return NextResponse.json({success: true});

}

