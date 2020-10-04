import React, { CSSProperties } from 'react';

export type NodeLabelProps = {
    content: string,
    fontSize: string,
    fontFamily: string,
    x?: number,
    y?: number,
    color?: string,
    style?: CSSProperties,
};

export const NodeLabel = (props: NodeLabelProps) => {
    return (
        <text x={props.x || 0} y={props.y || 0} fontSize={props.fontSize} fontFamily={props.fontFamily}
              textAnchor='middle' fill={props.color || 'black'} style={props.style}>
            {props.content}
        </text>
    );
};
