import { TaskState } from "flowcharts-common";
import React, { useRef, useEffect } from "react";
import { LockIcon, SandClockIcon, TickIcon } from "../../icons";
import { NodeLabel, NodeLabelProps } from "./NodeLabel";
import { NodeMarker, NodeMarkerProps } from "./NodeMarker";
import { PlanNode } from "./PlanNode";
import { Step } from "./Step";

type NodePointProps = {
    node: PlanNode,
    marker: NodeMarkerProps,
    label: NodeLabelProps,
    onClick?: (node: PlanNode) => void,
};

export const NodePoint = (props: NodePointProps) => {
    const gRef = useRef(null as SVGGElement | null);

    useEffect(() => {
        if (gRef.current !== null) {
            gRef.current.addEventListener('click', e => {
                e.stopPropagation();
                if (props.onClick !== undefined) {
                    props.onClick(props.node);
                }
            });

            gRef.current.addEventListener('mousedown', e => e.stopPropagation());
        }
    }, [gRef]);

    const iconStyle = { fill: props.marker.stroke, cursor: 'pointer' };

    const taskStateIcon = (taskState: TaskState) => {
        switch (taskState) {
            case 'completed':
                return TickIcon({ size: '15pt', style: iconStyle, x: -9, y: -10 });
            case 'inProgress':
                return SandClockIcon({ size: '15px', style: iconStyle, x: -8, y: -6 });
            case 'notStarted':
                return LockIcon({ size: '12px', style: iconStyle, x: -6, y: -6 });
        }
    };

    return (
        <g style={{cursor: 'pointer'}} ref={gRef}>
            <NodeMarker r={props.marker.r}
                        fill={props.marker.fill}
                        strokeWidth={props.marker.strokeWidth}
                        stroke={props.marker.stroke}/>
            <NodeLabel content={props.node.task.name}
                       fontSize={props.label.fontFamily}
                       fontFamily={props.label.fontFamily}
                       y={props.label.y}/>
            {props.node instanceof Step ? taskStateIcon(props.node.task.state) : ''}
        </g>
    );
};
