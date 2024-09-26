export enum AuthFlows {
    DEV= "dev",
    PROD = "prod",
    DEMO= "demo"
}

// I added the required fields for the demo and optional fields for future iterations
export interface TodoItem {
    id: string;
    title: string;
    order: number;
    completed: boolean;
    userId: string;
    projectId?: string;
    priority?: 0 | 1 | 2 | 3;
    description?: string;
    dueDate?: Date;
    startDate?: Date;
    status?: string;
    subTasks?: TodoItem[];
}


export interface TodoState {
    todos: TodoItem[];
    completedCount: number,
    incompleteCount: number,
    loading: boolean;
    error: Error | null;

}