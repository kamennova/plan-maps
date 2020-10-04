import React from 'react';

export type NodeMarkerProps = {
    r: number,
    fill: string,
    stroke: string,
    strokeWidth: string,
    cx?: number,
    cy?: number,
};

export const NodeMarker = (props: NodeMarkerProps) => {
    return (
        <circle cx={props.cx !== undefined ? props.cx : 0} cy={props.cy !== undefined ? props.cy : 0}
                r={props.r.toString()} fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth}>
        </circle>
    );
};



