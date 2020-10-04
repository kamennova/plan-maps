import { ChartUser } from "./ChartUser";
import { PlanNodeType } from "./NodeType";
import { TaskState } from "./TaskState";

export type ChartStyleProperties = {
    lineLength?: number,
    background?: string,
    minNodeSpanAngle?: number,
    chartDirectionAngle?: number
};

export type SerializedChart = {
    id: string,

    goal: SerializedTask,
    users: ChartUser[],
    nodes: SerializedPlanNode[],
    isDefaultHeadStage: boolean,
    isPublic: boolean,

    style: ChartStyleProperties,
};

export type SerializedTask = {
    id: string,
    name: string,
    state: TaskState,
    isOptional?: boolean,
    description?: string,
    deadline?: number, // timestamp
    userIds?: number[],
};

export type SerializedPlanNode = {
    id: string,
    type: PlanNodeType,
    task: SerializedTask,
    next: string[],
    color?: string,
    containerId: string | null,
};

export type SerializedStage = {
    id: string,
    type: 'stage',
    task: SerializedTask,
    next: [string] | [],
    color: string,
    containerId: null,
};

export type SerializedInnerPlanNode = {
    id: string,
    type: 'step' | 'branch',
    task: SerializedTask;
    next: string[],
    color?: string,
    containerId: string,
};

export type SerializedPlanNodeContainer = {
    id: string,
    type: 'stage' | 'branch',
    task: SerializedTask;
    next: string[],
    color?: string,
    containerId: string | null,
};
