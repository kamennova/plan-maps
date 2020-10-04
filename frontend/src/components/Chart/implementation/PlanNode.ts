import { Branch } from "./Branch";
import { PlanNodeView } from "./PlanNodeView";
import { Step } from "./Step";
import { Task } from "./Task";
import { Triangle } from "./Triangle";
import { UndefinedViewError } from "./UndefinedViewError";

export type InnerPlanNode = Step | Branch;

export enum InnerPlanNodeType {
    Step = "step",
    Branch = "branch",
}

export abstract class PlanNode {
    public id: string;
    public task: Task;
    public view?: PlanNodeView;
    public color?: string;

    protected constructor(task: Task, id: string, color?: string) {
        this.task = task;
        this.id = id;

        if (color !== undefined) {
            this.color = color;
        }
    }

    public getViewOrThrowError(): PlanNodeView {
        if (this.view === undefined) {
            throw new UndefinedViewError();
        }

        return this.view;
    }

    public abstract isTaskAvailable(): boolean;

    /**
     * Recursive function descending to leaves. Gets each node angle relative to parent node position
     *
     * If Node is not leaf:
     * 1) Get each lower node border angle and length, sum border angles
     * 2) Set children ownAngles (relatively to parent node) by sum
     * 3) Update this node's border angle and length
     */
    public getAnglesAlgoStep() {
        if (this.isLowestForAnglesAlgo()) {
            return;
        }

        this.setLowerNodesParentAngles();
        const lowerNodesSum = this.getLowerNodesParentAnglesSum();
        this.setNodesRelativeOwnAnglesByAnglesSum(this.lowerNodesForAnglesAlgo(), lowerNodesSum);

        this.getViewOrThrowError().border.length = this.getBorderLength();
        this.getViewOrThrowError().border.angle = this.getBorderAngle();
    }

    /**
     *  ~ If doesn't have lower nodes
     */
    public abstract isLowest(): boolean;

    /**
     * Array of nodes directly influencing this node's border angle width.
     *
     * For Step - previous nodes - step.prev
     * For PlanNodeContainer (Branch, Stage) - container.head. Branch can't have prev nodes,
     * and Stages may take full width of chart because they are sequential
     *
     */
    public abstract lowerNodes(): InnerPlanNode[];

    /**
     * Returns true, if this does not have any child nodes poining to this as to "priority" parent.
     */
    public isLowestForAnglesAlgo(): boolean {
        return this.lowerNodesForAnglesAlgo().length === 0;
    }

    /**
     * Returns child nodes with those with a different priority parent filtered out.
     *
     * For angles algorithm, it is a good idea to select one "priority" parent for all
     * nodes with multiple parents. "Priority" parent may be defined as a parent,
     * whose position and angle are the most suitable for child node position and angle
     * calculations in terms of ease of view.
     *
     * It it true that one node can have multuple "priority" parents. For example,
     * when number of parents is odd, those two in the middle are considered "priority".
     */
    public lowerNodesForAnglesAlgo(): InnerPlanNode[] {
        return this.lowerNodes().filter((node) => {
            if (node.next.length <= 1) {
                return true;
            }

            if (node.next.length % 2 === 1) {
                return this as PlanNode === node.next[Math.floor(node.next.length / 2)];
            }

            return this as PlanNode === node.next[node.next.length / 2]
                || this as PlanNode === node.next[(node.next.length / 2) - 1];
        });
    }

    /**
     * Sets each node's relative ownAngle (its angle relatively to parent node)
     */
    public setNodesRelativeOwnAnglesByAnglesSum(nodes: InnerPlanNode[], sum: number) {

        /**
         * Total angle between the first and last node of nodes[] =
         * lower nodes parentAngles sum + 'free space' angles between nodes
         */
        const nodesAngle = this.getViewOrThrowError().style.minNodesSpanAngle * (nodes.length - 1) + sum;
        let angle = -nodesAngle / 2 - this.getViewOrThrowError().style.minNodesSpanAngle;

        for (let i = 0, num = nodes.length; i < num; i++) {
            const node = nodes[i];

            if (node.view === undefined) {
                throw new UndefinedViewError();
            }

            const halfParent = node.view.parentAngle / 2;
            angle += this.getViewOrThrowError().style.minNodesSpanAngle + halfParent;

            node.view.ownAngle = angle;

            angle += halfParent;
        }
    }

    /**
     * Calculates and sets this node's lower nodes' parent angles
     * @see PlanNodeView.parentAngle
     */
    public setLowerNodesParentAngles() {
        for (const lower of this.lowerNodesForAnglesAlgo()) {
            if (lower.view === undefined) {
                throw new UndefinedViewError();
            }

            lower.getAnglesAlgoStep();
            this.getLowerNodeParentAngle(lower);
        }
    }

    public getLowerNodesParentAnglesSum(): number {
        let sum = 0;

        this.lowerNodesForAnglesAlgo().forEach((node) => {
            if (node.view === undefined) {
                throw new UndefinedViewError();
            }

            sum += node.view.parentAngle;
        });

        return sum;
    }

    public getLowerNodeParentAngle(lower: InnerPlanNode): number {
        if (lower.isLowest()) {
            return 0;
        }

        if (lower.view === undefined || this.view === undefined) {
            throw new UndefinedViewError();
        }

        const b = this.getNthLowerNodeLineLength();
        const c = lower.view.border.length;
        const a = Triangle.getSideByTwoSidesAndAngle(b, c, 180 - lower.view.border.angle);

        lower.view.parentAngle = Triangle.getAngleBySides(a, b, c) * 2;

        return lower.view.parentAngle;
    }

    public getBorderAngle(): number {
        if (this.isLowestForAnglesAlgo()) {
            return 0;
        }

        const leftLowerView = this.lowerNodesForAnglesAlgo()[0].view;

        if (leftLowerView === undefined) {
            return 0;
        }

        return Math.abs(leftLowerView.ownAngle) + leftLowerView.parentAngle / 2;
    }

    public getBorderLength(): number {
        if (this.isLowestForAnglesAlgo()) {
            return 0;
        }

        const leftLowerView = this.lowerNodesForAnglesAlgo()[0].view;

        if (leftLowerView === undefined) {
            return 0;
        }

        const b = this.getNthLowerNodeLineLength();
        const c = leftLowerView.border.length;
        const angle = 180 - leftLowerView.border.angle;

        return Triangle.getSideByTwoSidesAndAngle(b, c, angle);
    }

    /**
     * @returns length of this node's nth lower node connector
     * (currently all node connectors are equal in length, so no n is passed)
     */
    public getNthLowerNodeLineLength(): number {
        return this.getViewOrThrowError().style.lineLength;
    }

    public getSubtreeWidth() {
        return Math.abs(this.getViewOrThrowError().border.length * Math.sin(this.getViewOrThrowError().border.angle));
    }
}
