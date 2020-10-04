import { UserRole } from '../models';
import { SerializedPlanNode, TaskState, SerializedTask } from '../models';

export type AddChartNodeAction = {
    type: 'ADD_NODE',
    chartId: string,
    node: SerializedPlanNode,
};

export type UpdateChartNodeAction = {
    type: 'UPDATE_NODE',
    chartId: string,
    node: SerializedPlanNode,
};

export type DeleteChartNodeAction = {
    type: 'DELETE_NODE',
    chartId: string,
    node: SerializedPlanNode,
};

export type UpdateTaskStateForNodeAction = {
    type: 'UPDATE_TASK_STATE_FOR_NODE',
    chartId: string,
    nodeId: string,
    taskState: TaskState,
};

export type UpdateGoalAction = {
    type: 'UPDATE_GOAL',
    chartId: string,
    goal: SerializedTask,
};

export type RevokeAccessAction = {
    type: 'REVOKE_ACCESS',
    chartId: string,
    userId: number,
};

export type GrantAccessAction = {
    type: 'GRANT_ACCESS',
    chartId: string,
    userId: number,
    role: UserRole,
    invitedBy: number,
};

export type SetBackgroundAction = {
    type: 'SET_BACKGROUND',
    chartId: string,
    backgroundId: string | undefined,
};