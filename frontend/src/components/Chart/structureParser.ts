import { AssertionError } from "assert";
import { SerializedInnerPlanNode, SerializedPlanNode, SerializedStage, SerializedTask } from "flowcharts-common";
import {
    InnerNodeToLink,
    NodeToLink,
    StageToLink
} from "./types";
import { Stage } from "./implementation";
import { Branch } from "./implementation/Branch";
import { PlanNode } from "./implementation/PlanNode";
import { PlanNodeContainer } from "./implementation/PlanNodeContainer";
import { Step } from "./implementation/Step";
import { Task } from "./implementation/Task";

export const deserializeNodes = (serializedNodes: SerializedPlanNode[]): Stage[] => {
    const nodesToLink: NodeToLink[] = instantiateNodes(serializedNodes);

    return linkNodes(nodesToLink).filter(node => node instanceof Stage) as Stage[];
};

export const instantiateNodes = (serializedNodes: SerializedPlanNode[]): NodeToLink[] => {
    const nodesToLink: Array<NodeToLink> = serializedNodes.filter(node => node.type === 'stage')
        .map(stage => {
            return {
                node: instantiateStage(stage as SerializedStage),
                next: stage.next,
                containerId: null
            };
        });

    const firstStage: Stage = nodesToLink[0].node as Stage;

    serializedNodes.filter(node => isNodeInner(node)).forEach(
        node => nodesToLink.push({
            node: instantiateInnerPlanNode(node as SerializedInnerPlanNode, firstStage),
            next: node.next,
            containerId: node.containerId,
        })
    );

    return nodesToLink;
};

const instantiateStage = (node: SerializedStage): Stage => {
    return new Stage(deserializeTask(node.task), node.id, node.color);
};

const instantiateInnerPlanNode = (node: SerializedInnerPlanNode, container: PlanNodeContainer): PlanNode => {
    switch (node.type) {
        case 'step':
            return new Step(deserializeTask(node.task), container, node.id, node.color);
        case 'branch':
            return new Branch(deserializeTask(node.task), container, node.id, node.color);
    }
};

export const linkNodes = (nodes: NodeToLink[]): PlanNode[] => {
    const nodesToStructurize: NodeToLink[] = linkNodesToNext(nodes);

    return linkNodesToContainers(nodesToStructurize);
};

const deserializeTask = (props: SerializedTask): Task => {
    return new Task(props.name, props.state, props.id, props.isOptional, props.description);
};

export const linkNodesToNext = (nodesToLink: NodeToLink[]): NodeToLink[] => {
    const innerNodeObjects = nodesToLink.filter(obj => obj.node instanceof Step || obj.node instanceof Branch);
    const stageObjects = nodesToLink.filter(obj => obj.node instanceof Stage);

    return [...linkInnerNodes(innerNodeObjects as InnerNodeToLink[]), ...linkStages(stageObjects as StageToLink[])];
};

const linkStages = (stages: StageToLink[]): NodeToLink[] => {
    stages.forEach(stage => {
        if (stage.next.length === 0) {
            stage.node.next = null;
        } else {
            const nextObj = stages.find(obj => obj.node.id === stage.next[0]);

            if (nextObj === undefined) {
                throw new AssertionError({ message: 'Next stage not found' });
            }

            stage.node.setNext(nextObj.node);
        }
    });

    return stages;
};

const linkInnerNodes = (nodes: InnerNodeToLink[]): NodeToLink[] => {
    return nodes.map(nodeToLink => {
        if (nodeToLink.next.length > 0) {
            const nextNodes = nodes.filter(
                obj => obj.node instanceof Step && nodeToLink.next.includes(obj.node.id))
                .map(obj => obj.node as Step);

                nodeToLink.node.setNext(nextNodes);
        }

        return nodeToLink;
    });
};

export const linkNodesToContainers = (nodes: NodeToLink[]): PlanNode[] => {
    return nodes.map(obj => {
        if (isInnerPlanNode(obj.node) && obj.containerId !== null) {
            linkToContainer(obj as InnerNodeToLink, nodes);
        }

        return obj.node;
    });
};

const linkToContainer = (obj: InnerNodeToLink, nodes: NodeToLink[]) => {
    const containerObj = nodes.find(otherObj => otherObj.node.id === obj.containerId);

    if (containerObj === undefined || !(containerObj.node instanceof PlanNodeContainer)) {
        throw new AssertionError({ message: 'Incorrect Container id' });
    }

    obj.node.container = containerObj.node;

    if (obj.node.next.length === 0) {
        containerObj.node.head.push(obj.node);
    }
};

const isNodeInner = (node: SerializedPlanNode) => node.type === 'branch' || node.type === 'step';
const isInnerPlanNode = (node: PlanNode) => node instanceof Step || node instanceof Branch;
