import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { AuthFlows, TodoItem } from '@/interface/types';

const environment = process.env.ENVIRONMENT;

const todoApiUrl = environment === AuthFlows.DEMO
    ? process.env.MOCK_DATA_API_URL
    : process.env.CHRONICLE_API_GATEWAY;

const getTodoData = async (req: NextApiRequest): Promise<TodoItem[]> => {
    try {
        const { userId } = req.query;
        const url = userId ? `${todoApiUrl}/user/${userId}/todos/` : `${todoApiUrl}/todos`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch todos');
    }
};

const createTodoData = async (content: TodoItem): Promise<TodoItem> => {
    try {
        const response = await axios.post(`${todoApiUrl}/todos`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create todo');
    }
};

const saveTodoData = async (content: TodoItem): Promise<TodoItem> => {
    try {
        const response = await axios.put(`${todoApiUrl}/todos/${content.id}`, content);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update todo');
    }
};

const deleteTodoData = async (id: string | string[] | undefined): Promise<void> => {
    try {
        await axios.delete(`${todoApiUrl}/todos/${id}`);
    } catch (error) {
        throw new Error('Failed to delete todo');
    }
};

// API Route Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { content } = req.body;

    try {
        switch (method) {
            case 'GET': {
                const todos = await getTodoData(req);
                return res.status(200).json(todos);
            }
            case 'POST': {
                if (!content) {
                    return res.status(400).json({ error: 'Content is required' });
                }
                const newTodoData = await createTodoData(content);
                return res.status(201).json(newTodoData);
            }
            case 'PUT': {
                if (!content || !content.id) {
                    return res.status(400).json({ error: 'Todo ID is required for updating' });
                }
                const updatedTodoData = await saveTodoData(content);
                return res.status(200).json(updatedTodoData);
            }
            case 'DELETE': {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'ID is required for deletion' });
                }
                await deleteTodoData(id);
                return res.status(204).end();
            }
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
