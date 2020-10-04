import React from 'react';
import ReactDOM from 'react-dom';
import { AssertionError } from "assert";
import { toRad } from "./angleFuncs";
import { Branch } from "./Branch";
import { BranchView } from "./BranchView";
import { ChartStyle } from "./ChartStyle";
import { NodeLabel } from "./NodeLabel";
import { NodeMarker } from "./NodeMarker";
import { PlanChart } from "./PlanChart";
import { InnerPlanNode, PlanNode } from "./PlanNode";
import { Position } from "./Position";
import { Stage } from "./Stage";
import { StageView } from "./StageView";
import { Step } from "./Step";
import { StepView } from "./StepView";
import { UndefinedViewError } from "./UndefinedViewError";

export class PlanChartView {
    public style: ChartStyle;

    public svg: SVGSVGElement;
    private treeRootGroup: SVGSVGElement;
    public svgWidth: number;
    public svgHeight: number;
    public startPos: Position;
    public chart: PlanChart;
    public goalMargin: number = 80;

    constructor(svgElem: SVGSVGElement, chart: PlanChart, style: ChartStyle) {
        this.svg = svgElem;
        this.svgWidth = this.svg.clientWidth;
        this.svgHeight = this.svg.clientHeight;
        this.treeRootGroup = this.svg.getElementsByClassName('treeRootGroup')[0] as SVGSVGElement;
        this.style = style;
        this.startPos = new Position(this.svgWidth / 2, 220);
        this.chart = chart;

        this.initNodeViews();
    }

    public static getNodesAngles(stage: Stage) {
        stage.getAnglesAlgoStep();
    }

    public static getOwnAngleAndCoordinates(node: InnerPlanNode) {
        if (node.isStageHead()) { // stage head nodes have different layout
            return;
        }

        const parentPosition = PlanChartView.getNodeAngleComputationParentPosition(node);
        const distanceToParent = PlanChartView.getNodeAngleComputationParentDistance(node);
        const thisNodeView = node.getViewOrThrowError();

        thisNodeView.ownAngle += PlanChartView.getNodeAngleComputationParentAngle(node);
        thisNodeView.pos.x = parentPosition.x + distanceToParent * Math.sin(toRad(thisNodeView.ownAngle));
        thisNodeView.pos.y = parentPosition.y + distanceToParent * Math.cos(toRad(thisNodeView.ownAngle));
    }

    /**
     * Returns node parent, which should be used for angle-related calculations.
     *
     * This may also return two "center" parents if total number of parents is even.
     *
     * Consider this example:
     * A B C D E
     *  \ \|/ /
     *     F
     * Because number of parents is odd, C will be returned.
     *
     * In case there is an even number of parents:
     * A B C D
     *  \| |/
     *    F
     *
     * In this case, B and C will be returned.
     */
    public static getNodeAngleComputationParents(node: InnerPlanNode): PlanNode[] {
        if (node.next.length === 0) {
            return [node.container];
        }

        // if there is only one parent, simply return it
        if (node.next.length === 1) {
            return [node.next[0]];
        }

        // is there is an odd number of parents, return that in the middle
        if (node.next.length % 2 === 1) {
            return [node.next[Math.floor(node.next.length / 2)]];
        }

        // if number of parents is even, return two in the middle
        return [
            node.next[node.next.length / 2],
            node.next[(node.next.length / 2) - 1],
        ];
    }

    /** Returns position of parent or average if multiple. */
    public static getNodeAngleComputationParentPosition(node: InnerPlanNode): Position {
        const parents = PlanChartView.getNodeAngleComputationParents(node);

        // center is just an average of all parent coordinates
        return parents.map((parent) => parent.getViewOrThrowError().pos)
            .reduce((a, b) => a.add(b))
            .multiply(1 / parents.length);
    }

    /** Returns distance to parent or average if multiple. */
    public static getNodeAngleComputationParentDistance(node: InnerPlanNode): number {
        const parents = PlanChartView.getNodeAngleComputationParents(node);

        // line length is an average of all
        return parents.map((parent) => parent.getNthLowerNodeLineLength())
            .reduce((a, b) => a + b) / parents.length;
    }

    /** Returns own angle of a parent note or average if multiple. */
    public static getNodeAngleComputationParentAngle(node: InnerPlanNode): number {
        const parents = PlanChartView.getNodeAngleComputationParents(node);

        return parents.map((parent) => parent.getViewOrThrowError().ownAngle)
            .reduce((a, b) => a + b) / parents.length;
    }

    public static updateViewCoordinates(node: PlanNode) {
        if (node.view === undefined) {
            throw new UndefinedViewError();
        }

        node.view.g.setAttribute('transform',
            'translate(' + node.view.pos.x + ', ' + node.view.pos.y + ')');
    }

    public initNodeView(node: PlanNode) {
        const pos = new Position(this.startPos.x, this.startPos.y + this.goalMargin);

        if (node instanceof Step) {
            node.view = new StepView(node, pos, this.style, this.chart.onNodeClickEvent.bind(this.chart));
        } else if (node instanceof Stage) {
            node.view = new StageView(node, pos, this.style);
        } else if (node instanceof Branch) {
            node.view = new BranchView(node, pos, this.style, this.chart.onNodeClickEvent.bind(this.chart));
        } else {
            throw new AssertionError({ message: 'Unrecognized node class name' });
        }
    }

    public buildChart() {
        this.chart.orderedStages().forEach((stage) => this.buildChartStage(stage));
        this.firstTimeDraw();
    }

    public buildChartStage(stage: Stage) {
        this.flipNodes(stage);
        this.getNodesCoordinates(stage);
    }

    public flipNodes(_: Stage) {
        // ..
    }

    public getNodesCoordinates(stage: Stage) {
        PlanChartView.getNodesAngles(stage);
        this.getStageNodesCoordinatesByAngle(stage);
    }

    public getStageNodesCoordinatesByAngle(stage: Stage) {
        this.positionStage(stage);
        this.positionStageHead(stage);
        stage.innerNodes().forEach(PlanChartView.getOwnAngleAndCoordinates);
        stage.innerNodes().forEach(this.compareNodeCoordinates.bind(this));
    }

    public positionStage(stage: Stage) {
        const pos = new Position(this.startPos.x, this.startPos.y + this.goalMargin);

        if (stage.next !== null) {
            if (stage.next.view === undefined) {
                throw new UndefinedViewError();
            }

            pos.y = stage.next.view.farthestPos.y + this.style.stageGap * Math.cos(toRad(this.style.chartDirectionAngle));
        }

        const parentStagesHeight = pos.y - this.startPos.y;
        pos.x = this.startPos.x + Math.tan(toRad(this.style.chartDirectionAngle)) * parentStagesHeight;

        if (stage.view === undefined) {
            throw new UndefinedViewError();
        }

        if (pos.y > stage.view.farthestPos.y) {
            stage.view.farthestPos.y = pos.y;
        }

        stage.view.pos = pos;
    }

    /**
     * Sets coordinates of stage's head nodes
     * @param stage
     */
    public positionStageHead(stage: Stage) {
        if (stage.view === undefined) {
            throw new UndefinedViewError();
        }

        const nodesNum = stage.head.length;

        if (nodesNum === 0) {
            return;
        }

        const headWidthInPx = stage.getHeadWidth();
        const firstNode = stage.head[0];
        // position in px relatively to container's start pos
        let nodePosXInHead = -(headWidthInPx / 2) - this.style.minHeadNodeGap + firstNode.getSubtreeWidth() / 2;
        let prevNodeSubtreeWidth = 0;

        for (let i = 0; i < nodesNum; i++) {
            const node = stage.head[i];
            const nodeSubtreeWidth = node.getSubtreeWidth();
            nodePosXInHead += prevNodeSubtreeWidth / 2 + this.style.minHeadNodeGap + nodeSubtreeWidth / 2;

            this.positionStageHeadNode(node, nodePosXInHead);

            prevNodeSubtreeWidth = nodeSubtreeWidth;
        }
    }

    /**
     * Sets stage's head node coordinates by node's distance from
     * the middle of head (relativePosX)
     */
    public positionStageHeadNode(node: InnerPlanNode, relativePosX: number): void {
        if (node.view === undefined || node.container.view === undefined) {
            throw new UndefinedViewError();
        }

        const dirAngleRad = toRad(this.style.chartDirectionAngle);

        node.view.pos.x = node.container.view.pos.x + relativePosX * Math.cos(dirAngleRad);
        node.view.pos.y = node.container.view.pos.y + relativePosX * Math.sin(dirAngleRad);
    }

    /**
     * If node is positioned farther than its Stage's current farthest node,
     * set its position as Stage's farthestPos
     *
     * @param node
     */
    public compareNodeCoordinates(node: InnerPlanNode): void {
        const stage = node.parentStage();

        if (node.view === undefined || stage.view === undefined) {
            throw new UndefinedViewError();
        }

        if (this.isPositionFarther(node.view.pos, stage.view.farthestPos)) {
            stage.view.farthestPos = node.view.pos;
        }
    }

    public isPositionFarther(farther: Position, closer: Position) {
        return farther.y > closer.y;

        /*const f = farther.toBottomBasedSystem(this.svgHeight);
        const c = closer.toBottomBasedSystem(this.svgHeight);

        return f.isFartherThan(c, this.style.chartDirectionAngle); */
    }

    public firstTimeDraw() {
        this.updateCoordinates();
        this.drawGoal();

        if (this.chart.stages.length > 1 || !this.chart.isHeadStageDefault) {
            this.chart.orderedStages().forEach(stage => {
                if (stage.view === undefined) {
                    throw new AssertionError({ message: 'View should already be set' });
                }

                stage.view.drawDelimiter(stage);
                this.appendToSVG(stage);
            });
        }

        this.chart.innerNodes().forEach(this.appendToSVG.bind(this));
        this.chart.innerNodes().forEach(node => {
            if (node.view === undefined) {
                throw new AssertionError({ message: 'View should already be set' });
            }

            node.view.createConnectors(node.lowerNodes());
        })
    }

    public drawGoal() {
        const goalGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        goalGroup.setAttribute('cursor', 'pointer');

        const goal = (
            <NodeMarker r={11} stroke='#9098f1' strokeWidth='10px' fill='#d1d8ff' cx={this.startPos.x}
                        cy={this.startPos.y}/>
        );

        const goalLabel = (
            <NodeLabel content={this.chart.goal.name} color='black' fontSize='13px' fontFamily='Roboto'
                       x={this.startPos.x} y={this.startPos.y + 35}/>
        );

        this.treeRootGroup.appendChild(goalGroup);

        ReactDOM.render([goal, goalLabel], goalGroup);
    }

    public updateCoordinates() {
        this.chart.nodes().forEach(PlanChartView.updateViewCoordinates.bind(this));
    }

    public appendToSVG(node: PlanNode) {
        if (node.view === undefined) {
            throw new UndefinedViewError();
        }

        this.treeRootGroup.appendChild(node.view.g);
    }

    private initNodeViews() {
        this.chart.nodes().forEach(this.initNodeView.bind(this));
    }

    public clear() {
        Array.from(this.svg.getElementsByClassName('connectors')[0].children)
            .forEach(c => c.remove());
        Array.from(this.treeRootGroup.getElementsByTagName('g'))
            .filter(element => element.getAttribute('class') !== 'connectors')
            .forEach(element => element.remove());
    }
}
