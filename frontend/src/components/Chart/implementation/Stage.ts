import { PlanChart } from "./PlanChart";
import { PlanNode, InnerPlanNode } from "./PlanNode";
import { PlanNodeContainer } from "./PlanNodeContainer";
import { StageView } from "./StageView";
import { Task } from "./Task";

export class Stage extends PlanNodeContainer {
    public view?: StageView;
    public next: Stage | null;
    public prev: Stage | null = null;
    public color: string;

    constructor(task: Task, id: string, color: string, next: Stage | null = null) {
        super(task, id, color);
        this.color = color;
        this.next = next;
    }

    public isTaskAvailable(): boolean {
        return this.prev === null || this.prev.task.state === 'completed';
    }

    public setNext(stage: Stage){
        this.next = stage;
        stage.prev = this;
    }

    public innerNodes(): InnerPlanNode[] {
        return PlanChart.nodesFromHead(this.head);
    }

    public parentNode(): PlanNode {
        if (this.next !== null) {
            return this.next;
        }

        throw new Error('No next stages');
    }

    public getHeadWidth(): number {
        if (this.head.length === 0) {
            return 0;
        }

        return this.getHeadNodesSubtreesWidthSum() +
            (this.head.length - 1) * this.getViewOrThrowError().style.minHeadNodeGap;
    }

    public getHeadNodesSubtreesWidthSum(): number {
        let sum = 0;

        this.head.forEach((node) => sum += node.getSubtreeWidth());

        return sum;
    }
}
