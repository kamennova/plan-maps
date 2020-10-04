import {
    SerializedChart,
    SerializedInnerPlanNode,
    SerializedPlanNode,
    SerializedStage,
} from "flowcharts-common";
import { structurizeNodes } from "./structurizeNodes";
import { TaskFilters } from "./TaskFilters";

export type StageWithStructure = SerializedStage & { structure: InnerNodeWithStructure[] };
export type NodeWithStructure = SerializedPlanNode & { structure: InnerNodeWithStructure[] };
export type InnerNodeWithStructure = SerializedInnerPlanNode & { structure: InnerNodeWithStructure[] };

export const getTasksByFilter = (chart: SerializedChart, filters: TaskFilters) => {
    const nodes = filterTasks(chart.nodes, filters);
    const stages = chart.nodes.filter(node => node.type === 'stage');

    return structurizeNodes([...nodes, ...stages]);
};

const filterTasks = (nodes: SerializedPlanNode[], filters: TaskFilters) => nodes.filter(node => {
    if (node.type === 'stage') {
        return false;
    }

    if (!filters.state.includes(node.task.state)) {
        return false;
    }

    if (filters.thisUser !== undefined && filters.thisUserId !== undefined && filters.thisUser) {
        if (!node.task.userIds?.includes(filters.thisUserId)) {
            return false;
        }
    }

    return true;
});
