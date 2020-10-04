import { SerializedChart, SerializedPlanNode } from "flowcharts-common";
import { replaceNodeInArray } from "./addNode";
import { findNodePrevs } from "./nodeSearch";

export const deleteNodeById = (chart: SerializedChart,  deleteNode: SerializedPlanNode): SerializedChart => {
    const newChart = { ...chart };

    if (deleteNode.type === 'stage' || deleteNode.type === 'branch') {
        newChart.nodes = deleteNodeChildren(newChart.nodes, deleteNode.id);
    }

    if (deleteNode.type === 'step' || deleteNode.type === 'stage') {
        const updatedPrevs = findAndUpdateNodePrevsNext(deleteNode, newChart.nodes);
        updatedPrevs.forEach(prev => newChart.nodes = replaceNodeInArray(prev, newChart.nodes));
    }

    newChart.nodes = newChart.nodes.filter(node => node.id !== deleteNode.id);

    return newChart;
};

const deleteNodeChildren = (nodes: SerializedPlanNode[], nodeId: string): SerializedPlanNode[] => {
    return nodes.filter(node => node.containerId !== nodeId);
};

const findAndUpdateNodePrevsNext = (node: SerializedPlanNode, nodes: SerializedPlanNode[]): SerializedPlanNode[] => {
    const prevs = findNodePrevs(node.id, nodes);

    return prevs.map(prev => {
        let newNext = prev.next.filter(nextId => nextId !== node.id);
        newNext = [...newNext, ...node.next];

        return { ...prev, next: newNext };
    });
};
