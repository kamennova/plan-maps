import { Branch } from "./Branch";
import { InnerPlanNodeInterface } from "./InnerPlanNodeInterface";
import { InnerPlanNode, PlanNode } from "./PlanNode";
import { PlanNodeContainer } from "./PlanNodeContainer";
import { Stage } from "./Stage";
import { StepView } from "./StepView";
import { Task } from "./Task";

export class Step extends PlanNode implements InnerPlanNodeInterface {
    public view?: StepView;
    public prev: InnerPlanNode[] = [];
    public next: Step[] = [];
    public container: PlanNodeContainer;

    constructor(task: Task, container: PlanNodeContainer, id: string, color?: string) {
        super(task, id, color);

        this.container = container;
    }

    public isTaskAvailable(): boolean {
        return !this.prev.find(prev => !prev.task.isOptional && prev.task.state !== 'completed');
    }

    public setNext(next: Step[]): void {
        this.next = next;
        next.filter(nextStep => !nextStep.prev.includes(this))
            .forEach(nextStep => nextStep.prev.push(this));
    }

    public isLowest() {
        return this.prev.length === 0;
    }

    public lowerNodes() {
        return this.prev;
    }

    public parentStage(): Stage {
        let container = this.container;

        while (container instanceof Branch) {
            container = container.container;
        }

        if (!(container instanceof Stage)) {
            throw new Error('The top container should be Stage instance');
        }

        return container;
    }

    public parentNode(): PlanNode {
        return this.next.length > 0 ? this.next[0] : this.container;
    }

    public isStageHead(): boolean {
        return this.next.length === 0 && this.container instanceof Stage;
    }
}
