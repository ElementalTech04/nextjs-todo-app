import {NextApiRequest, NextApiResponse} from "next";
import {AuthFlows} from "@/interface/types";

const environment = process.env.ENVIRONMENT;

const todoApi = environment === AuthFlows.DEMO ? process.env.DEMO_API : process.env.LAMBDA_API;

const getTodoData = (req: NextApiRequest) => {
}

const saveTodoData = (content: any) => {

}

const createTodoData = (content:any) => {

}

const deleteTodoData = (id: string) => {
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    const { content } = req.body;

    try {
        switch (method) {
            case 'GET':
                return res.status(200).json(getTodoData);
            case 'POST':
                if (!content) {
                    return res.status(400).json({ error: 'Content is required' });
                }
                const newTodoData = createTodoData(content);
                return res.status(201).json(newTodoData);
            case 'PUT':
                saveTodoData(content);
                return res.status(200).json(content);
            case 'DELETE':
                deleteTodoData(req.query.id);
                return res.status(204).end()
            default:
                return res.status(401).json({error: 'Method not allowed'});
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}