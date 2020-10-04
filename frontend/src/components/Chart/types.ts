import { Stage } from "./implementation";
import { PlanNode } from "./implementation/PlanNode";
import { Step } from "./implementation/Step";
import { Branch } from "./implementation/Branch";

export type NodeToLink = {
    node: PlanNode,
    next: string[],
    containerId: string | null,
};

export type StageToLink = {
    node: Stage,
    next: [string] | [],
    containerId: null,
};

export type InnerNodeToLink = {
    node: Step | Branch,
    next: string[],
    containerId: string,
};
