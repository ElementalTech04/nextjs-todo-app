export enum AuthFlows {
    DEV= "dev",
    PROD = "prod",
    DEMO= "demo"
}

// I added the required fields for the demo and optional fields for future iterations
export interface TodoItem {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
    projectId?: string;
    priority?: string;
    description?: string;
    dueDate?: string;
    status?: string;
    subTasks?: TodoItem[];
}