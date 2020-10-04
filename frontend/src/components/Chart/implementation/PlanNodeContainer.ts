import {InnerPlanNode, PlanNode} from "./PlanNode";

export abstract class PlanNodeContainer extends PlanNode {
    public head: InnerPlanNode[] = [];

    public isLowest(): boolean {
        return this.head.length === 0;
    }

    public lowerNodes() {
        return this.head;
    }
}
