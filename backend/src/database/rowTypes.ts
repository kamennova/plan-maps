import { PlanNodeType } from "flowcharts-common";

export type nodeRow = {
    id: string,
    color?: string,
    node_type: PlanNodeType,
    task_id: string,
    container_id: string | null,
};

export type connectionRow = {
    node_id: string,
    next_node_id: string,
    chart_id: string,
};
