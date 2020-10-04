import { BranchView } from "./BranchView";
import { InnerPlanNodeInterface } from "./InnerPlanNodeInterface";
import { InnerPlanNode, PlanNode } from "./PlanNode";
import { PlanNodeContainer } from "./PlanNodeContainer";
import { Stage } from "./Stage";
import { Step } from "./Step";
import { Task } from "./Task";

export class Branch extends PlanNodeContainer implements InnerPlanNodeInterface {
    public prev = null;
    public next: Step[] = [];
    public view?: BranchView;

    /**
     * Instance of PlanNodeContainer (Branch or Stage) containing this branch
     */
    public container: PlanNodeContainer;

    public head: InnerPlanNode[] = [];

    constructor(task: Task, container: PlanNodeContainer, id: string, color?: string) {
        super(task, id, color);

        this.container = container;
    }

    public isTaskAvailable(): boolean {
        return this.container.isTaskAvailable();
    }

    public setNext(next: Step[]): void {
        this.next = next;
        next.filter(nextStep => !nextStep.prev.includes(this))
            .forEach(nextStep => nextStep.prev.push(this));
    }

    /**
     * @return Stage which contains (possibly not directly) this branch
     */
    public parentStage(): Stage {
        let container = this.container;

        while (container instanceof Branch) {
            container = container.container;
        }

        if (!(container instanceof Stage)) {
            throw new Error('Last container should be Stage instance');
        }

        return container;
    }

    public parentNode(): PlanNode {
        return this.next.length > 0 ? this.next[0] : this.container;
    }

    /**
     * Check if this branch is in the head of its stage
     */
    public isStageHead(): boolean {
        return this.next.length === 0 && this.container instanceof Stage;
    }
}
