import { Task } from "./Task";

export type userInnerPlanNode = {
    task: Task;
    type?: string,
    id: string,
    next: string[],
    structure?: userInnerPlanNode[],
    color?: string,
};
