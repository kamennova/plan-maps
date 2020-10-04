import React from "react";
import ReactDOM from "react-dom";
import { Branch } from "./Branch";
import { ChartStyle } from "./ChartStyle";
import { InnerPlanNodeView } from "./InnerPlanNodeView";
import { NodePoint } from "./NodePoint";
import { InnerPlanNode, PlanNode } from "./PlanNode";
import { PlanNodeView } from "./PlanNodeView";
import { Position } from "./Position";
import { UndefinedViewError } from "./UndefinedViewError";

export class BranchView extends PlanNodeView implements InnerPlanNodeView {
    public connectors: SVGLineElement[] = [];

    constructor(node: Branch, pos: Position, style: ChartStyle, onNodeClickEvent?: (node: PlanNode) => void) {
        super(node, pos, style);
        const color = node.parentStage().color;

        const point = (
            <NodePoint
                node={node}
                onClick={onNodeClickEvent?.bind(this, node)}
                marker={{...this.style.branchMarker, stroke: color, fill: color}}
                label={{
                    ...this.style.label,
                    content: node.task.name,
                    y: this.style.branchMarker.r + this.style.label.margin
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
}
