import {InnerPlanNode} from "./PlanNode";

export interface InnerPlanNodeView {
    createConnectors(prevNodes: InnerPlanNode[]): void;
}
