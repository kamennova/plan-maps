import React from 'react';
import ReactDOM from "react-dom";

import { ChartStyle } from "./ChartStyle";
import { NodeLabel } from "./NodeLabel";
import { PlanNodeView } from "./PlanNodeView";
import { Position } from "./Position";
import { Stage } from "./Stage";

export class StageView extends PlanNodeView {
    public farthestPos: Position;

    constructor(node: Stage, pos: Position, style: ChartStyle) {
        super(node, pos, style);

        this.ownAngle = this.style.chartDirectionAngle;
        this.farthestPos = pos;
    }

    public drawDelimiter(node: Stage) {
        const width = node.getHeadWidth() + 190;
        const lineY = -35;

        const delimiter = (
            <line x1={-width / 2} y1={lineY} x2={width / 2} y2={lineY} stroke={node.color} strokeDasharray="2"/>);
        const label = (
            <NodeLabel style={{ textTransform: 'uppercase', textAnchor: 'start' }} content={node.task.name}
                       fontSize='13px' fontFamily={'Roboto'} x={-width / 2} y={-20}/>);

        ReactDOM.render([delimiter, label], this.g);
    }
}
