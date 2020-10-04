import React from 'react';
import ReactDOM from 'react-dom';

import { ChartStyle } from "./ChartStyle";
import { InnerPlanNodeView } from "./InnerPlanNodeView";
import { NodePoint } from "./NodePoint";
import { InnerPlanNode, PlanNode } from "./PlanNode";
import { PlanNodeView } from "./PlanNodeView";
import { Position } from "./Position";
import { Step } from "./Step";
import { UndefinedViewError } from "./UndefinedViewError";

export class StepView extends PlanNodeView implements InnerPlanNodeView {
    public connectors: SVGLineElement[] = [];

    constructor(node: Step, pos: Position, style: ChartStyle, onNodeClickEvent?: (node: PlanNode) => void) {
        super(node, pos, style);

        const point = (
            <NodePoint onClick={onNodeClickEvent?.bind(this, node)}
                       node={node}
                       marker={{ ...this.style.stepMarker, stroke: node.parentStage().color }}
                       label={{
                           ...this.style.label,
                           content: node.task.name,
                           y: this.style.stepMarker.r + this.style.label.margin
                       }}/>
        );

        ReactDOM.render(point, this.g);
    }

    public connector(prev: InnerPlanNode): SVGLineElement {
        if (prev.view === undefined) {
            throw new UndefinedViewError();
        }

        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('x1', this.pos.x.toString());
        line.setAttribute('y1', this.pos.y.toString());
        line.setAttribute('x2', prev.view.pos.x.toString());
        line.setAttribute('y2', prev.view.pos.y.toString());
        line.setAttribute('stroke', this.style.lineStroke);
        line.setAttribute('stroke-dasharray', '4');

        return line;
    }

    public createConnectors(prevNodes: InnerPlanNode[]) {
        for (const prev of prevNodes) {
            const line = this.connector(prev);

            this.connectors.push(line);
            this.insertIntoConnectorsGroup(line);
        }
    }

    public updateConnectors(nextNodes: InnerPlanNode[]) {
        for (const next of nextNodes) {
            const line = this.connector(next);
            this.connectors.push(line);
            this.insertIntoGroup(line);
        }
    }
}
