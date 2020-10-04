import { AssertionError } from "assert";
import { SerializedChart, SerializedInnerPlanNode, SerializedPlanNode, SerializedStage } from "flowcharts-common";

export const findNodeById = (id: string, nodes: SerializedPlanNode[]): SerializedPlanNode | undefined =>
    nodes.find(node => node.id === id);

export const findStageById = (id: string, nodes: SerializedPlanNode[]): SerializedStage => {
    const stage = nodes.find(node => node.type === 'stage' && node.id === id);

    if (!stage) {
        throw new AssertionError({ message: 'Stage not found ヽ(；▽；)ノ' });
    }

    return stage as SerializedStage;
};

export const findStageByNext = (next: string | null, nodes: SerializedPlanNode[]): SerializedStage => {
    const stage = nodes.find(node => node.type === "stage" &&
    next ? node.next[0] === next : node.next.length === 0);

    if (!stage) {
        throw new AssertionError({ message: 'Stage not found ヽ(；▽；)ノ' });
    }

    return stage as SerializedStage;
};

export const findNodePrevs = (id: string, nodes: SerializedPlanNode[]): SerializedPlanNode[] => {
    return nodes.filter(node => node.next.includes(id));
};

export const getStageBranches = (stageId: string, nodes: SerializedPlanNode[]): SerializedInnerPlanNode[] => {
    return nodes.filter(node => node.type === 'branch')
        .filter(branch => getNodeStage(branch as SerializedInnerPlanNode, nodes).id === stageId) as SerializedInnerPlanNode[];
};

export const getContainerSteps = (containerId: string, nodes: SerializedPlanNode[]): SerializedInnerPlanNode[] => {
    return nodes.filter(node => node.type === 'step')
        .filter(step => isNodeInContainer(step as SerializedInnerPlanNode, containerId,
            nodes))as SerializedInnerPlanNode[];
};

const isNodeInContainer = (node: SerializedInnerPlanNode, containerId: string, nodes: SerializedPlanNode[]): boolean => {
    if (node.containerId === containerId) {
        return true;
    }

    const container = findNodeById(node.containerId, nodes);
    if (container === undefined) {
        throw new AssertionError({ message: `Node with id ${node.containerId} not found (;﹏;)` });
    }
    if (container.type === 'stage') {
        return false;
    }

    return isNodeInContainer(container as SerializedInnerPlanNode, containerId, nodes);
};

export const getNodeStage = (node: SerializedInnerPlanNode, nodes: SerializedPlanNode[]): SerializedStage => {
    const container = findNodeById(node.containerId, nodes);

    if (container === undefined) {
        throw new AssertionError({ message: `Node with id ${node.containerId} not found (;﹏;)` });
    }

    if (container.type === 'stage') {
        return container as SerializedStage;
    }

    return getNodeStage(container as SerializedInnerPlanNode, nodes);
};

export const getChartStages = (chart: SerializedChart): SerializedStage[] => {
    return chart.nodes.filter(node => node.type === 'stage') as SerializedStage[];
};
