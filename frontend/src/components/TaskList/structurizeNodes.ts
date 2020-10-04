import { AssertionError } from "assert";
import { SerializedPlanNode } from "flowcharts-common";
import { InnerNodeWithStructure, NodeWithStructure, StageWithStructure } from "./getTasksByFilter";

export const structurizeNodes = (nodes: SerializedPlanNode[]): StageWithStructure[] => {
    const stagesNum = nodes.filter(node => node.type === 'stage').length;
    let higherNodes: NodeWithStructure[] = nodes.map(node => ({ ...node, structure: [] }));

    do {
        higherNodes = moveLowerNodesToContainers(higherNodes);
    } while (higherNodes.length !== stagesNum);

    return higherNodes as StageWithStructure[];
};

const moveLowerNodesToContainers = (allNodes: NodeWithStructure[]): NodeWithStructure[] => {
    const higher: NodeWithStructure[] = [];
    const lower: NodeWithStructure[] = [];

    allNodes.forEach(node => isNodeLowestInArray(node, allNodes) ? lower.push(node) : higher.push(node));

    return insertLowerNodesIntoContainers(lower, higher);
};

const isNodeLowestInArray = (node: SerializedPlanNode, array: SerializedPlanNode[]): boolean =>
    node.type === 'step' ||
    (node.type === 'branch' &&
        array.find(otherNode => otherNode.containerId === node.id) === undefined);

const insertLowerNodesIntoContainers = (lower: NodeWithStructure[], higher: NodeWithStructure[]):
    NodeWithStructure[] => {
    const containers = [...higher];

    lower.forEach(lowerNode => {
        const nodeContainer = containers.find(container => container.id === lowerNode.containerId);

        if (nodeContainer === undefined) {
            throw new AssertionError({ message: `Node container with id ${lowerNode.containerId} not found` });
        }

        nodeContainer.structure.push(lowerNode as InnerNodeWithStructure)
    });

    return containers;
};
