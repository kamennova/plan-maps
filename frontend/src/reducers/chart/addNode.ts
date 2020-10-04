import {
    SerializedChart,
    SerializedPlanNode,
} from "flowcharts-common";
import { findNodeById, findStageByNext } from "./nodeSearch";
import { AssertionError } from "assert";

export const addStep = (chart: SerializedChart, insertNode: SerializedPlanNode, prev: string[]): SerializedChart => {
    const newChart = { ...chart };

    if (prev.length > 0) {
        newChart.nodes = updateStepPrevs(prev, insertNode, chart.nodes);
    }

    newChart.nodes.push({
        type: 'step',
        ...insertNode,
    });

    return newChart;
};

const updateStepPrevs = (prev: string[], insertNode: SerializedPlanNode, nodes: SerializedPlanNode[]): SerializedPlanNode[] => {
    let updatedNodes: SerializedPlanNode[] = nodes;

    prev.forEach(prevId => {
        const prevNode = findNodeById(prevId, nodes);
        if (prevNode === undefined) {
            throw new AssertionError({ message: `Node with id ${prevId} not found (;﹏;)` });
        }
 
        /**
         * If insertNode's previous is already connected to some of insertNode's next, delete these connections
         * to avoid unnecessary loops like this:
         *         next           next
         *      /      |           |
         *     /       |           |
         * insertNode  |   ->   insertNode
         *      ＼     |            |
         *       ＼    |            |
         *         prev            prev
         **/
        const updatedNext = prevNode.next.filter(prevsNext => !insertNode.next.includes(prevsNext));
        updatedNext.push(insertNode.id);

        updatedNodes = replaceNodeInArray({ ...prevNode, next: updatedNext }, updatedNodes);
    });

    return updatedNodes;
};

export const addBranch = (chart: SerializedChart, insertNode: SerializedPlanNode): SerializedChart => {
    const newChart = { ...chart };

    newChart.nodes.push({
        type: 'branch',
        ...insertNode,
    });

    return newChart;
};

export const addStage = (chart: SerializedChart, stage: SerializedPlanNode): SerializedChart => {
    const newChart: SerializedChart = { ...chart };
    const updatedStage: SerializedPlanNode = (stage.next.length === 0) ?
        findAndUpdateOldHeadStageNext(stage.id, newChart.nodes) :
        findAndUpdateOldPrevStageNext(stage.next[0], stage.id, newChart.nodes);

    newChart.nodes = replaceNodeInArray(updatedStage, newChart.nodes);
    newChart.nodes.push({
        type: 'stage',
        containerId: null,
        ...stage
    });

    return newChart;
};

const findAndUpdateOldHeadStageNext = (nextId: string, nodes: SerializedPlanNode[]): SerializedPlanNode => {
    const oldHeadStage = findStageByNext(null, nodes);

    return { ...oldHeadStage, next: [nextId] };
};

const findAndUpdateOldPrevStageNext = (oldNextId: string, newNextId: string, nodes: SerializedPlanNode[]): SerializedPlanNode => {
    const prevStage = findStageByNext(oldNextId, nodes);

    return { ...prevStage, next: [newNextId] };
};

export const replaceNodeInArray = (newNode: SerializedPlanNode, nodeArray: SerializedPlanNode[]): SerializedPlanNode[] => {
    return nodeArray.map(node => node.id === newNode.id ? newNode : node);
};
