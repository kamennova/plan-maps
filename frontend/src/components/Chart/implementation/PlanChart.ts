import { AssertionError } from 'assert';
import { ChartUser } from "flowcharts-common";
import { Branch } from "./Branch";
import { ChartStyle } from "./ChartStyle";
import { Goal } from "./Goal";
import { PlanChartView } from "./PlanChartView";
import { InnerPlanNode, InnerPlanNodeType, PlanNode } from "./PlanNode";
import { PlanNodeContainer } from "./PlanNodeContainer";
import { Stage } from "./Stage";
import { Step } from "./Step";
import { Task } from "./Task";
import { userInnerPlanNode } from "./userInnerPlanNode";

export class PlanChart {
    public goal: Goal;
    public isPublic: boolean;
    public stages: Stage[] = [];
    public view: PlanChartView;
    public users: ChartUser[] = [];
    public isHeadStageDefault: boolean;
    public headStage: Stage;

    public nodeClickHandler?: (node: PlanNode) => void;

    constructor(isPublic: boolean, goal: Goal, stages: Stage[], svg: SVGSVGElement, style: ChartStyle,
                isDefaultStage: boolean) {
        this.isHeadStageDefault = isDefaultStage;
        this.isPublic = isPublic;
        this.goal = goal;
        this.stages = stages;

        const headStage = stages.find(stage => stage.next === null);
        if (headStage === undefined) {
            throw new AssertionError({ message: 'Head stage is not defined' })
        }

        this.headStage = headStage;
        this.view = new PlanChartView(svg, this, style);
    }

    public static getInnerPlanNodeTypeName(typeName: string | undefined): InnerPlanNodeType {
        if (typeName === undefined || typeName === InnerPlanNodeType.Step) {
            return InnerPlanNodeType.Step;
        } else if (typeName === InnerPlanNodeType.Branch) {
            return InnerPlanNodeType.Branch;
        }

        throw new AssertionError({ message: 'Unrecognized innerPlanNode type: ' + typeName });
    }

    public static instantiateInnerPlanNode(objType: InnerPlanNodeType, task: Task, container: PlanNodeContainer) {
        if (objType === InnerPlanNodeType.Step) {
            return new Step(task, container, '1');
        }

        return new Branch(task, container, '1');
    }

    public static newInnerPlanNode(obj: userInnerPlanNode, nodeContainer: PlanNodeContainer): InnerPlanNode {
        const className: InnerPlanNodeType = PlanChart.getInnerPlanNodeTypeName(obj.type);

        return PlanChart.instantiateInnerPlanNode(className, obj.task, nodeContainer);
    }

    public static isHeadNodeObj(obj: userInnerPlanNode) {
        return obj.next.length === 0;
    }

    public orderedStages(): Stage[] {
        return this.orderedStagesStep(this.headStage);
    }

    public orderedStagesStep(stage: Stage, arr: Stage[] = []): Stage[] {
        const newArr = [...arr, stage];
        return stage.prev === null ? newArr : this.orderedStagesStep(stage.prev, newArr);
    }

    public nodes(): PlanNode[] {
        return this.orderedStages().flatMap(stage => [
            stage,
            ...PlanChart.nodesFromHead(stage.head)
        ]);
    }

    public innerNodes(): InnerPlanNode[] {
        return this.nodes()
            .filter(node => !(node instanceof Stage)) as InnerPlanNode[];
    }

    public static nodesFromHead(head: InnerPlanNode[]): InnerPlanNode[] {
        return head.flatMap(PlanChart.nodesFromNode);
    }

    private static nodesFromNode(node: InnerPlanNode): InnerPlanNode[] {
        if (node instanceof Branch) {
            return [node, ...PlanChart.nodesFromHead(node.head)];
        } else if (node.prev.length >= 0) {
            return [node, ...node.prev.flatMap(PlanChart.nodesFromNode)];
        } else {
            return [node];
        }
    }

    public draw() {
        this.view.buildChart();
    }

    public clear() {
        this.view.clear();
    }

    public onNodeClickEvent(node: PlanNode) {
        if (this.nodeClickHandler !== undefined) {
            this.nodeClickHandler(node);
        }
    }
}
