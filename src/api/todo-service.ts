import {NextApiRequest, NextApiResponse} from "next";
import {AuthFlows} from "@/interface/types";

const environment = process.env.ENVIRONMENT;

const todoApi = environment === AuthFlows.DEMO ? process.env.DEMO_API : process.env.LAMBDA_API;

const getTodoData = (req: NextApiRequest, res: NextApiResponse) => {
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    try {
        switch (method) {
            case 'GET':
                return res.status(200).json(getTodoData);
            default:
                return res.status(401).json({error: 'Method not allowed'});
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}