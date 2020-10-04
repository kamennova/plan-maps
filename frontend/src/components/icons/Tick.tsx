import React from "react";
import { DEFAULT_SIZE, IconProps } from "./iconProps";

export const TickIcon = (props: IconProps) => {
    return (
        <svg viewBox='0 0 48 48'
             x={props.x || 0}
             y={props.y || 0}
             width={props.size || DEFAULT_SIZE}
             height={props.size || DEFAULT_SIZE}
             xmlns="http://www.w3.org/2000/svg"
             style={props.style}>
            <path d='M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z'/>
        </svg>
    );
};
