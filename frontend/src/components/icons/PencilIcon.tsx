import React from "react";
import { DEFAULT_SIZE, IconProps } from "./iconProps";

export const PencilIcon = (props: IconProps) => {
    return (
        <svg viewBox='0 0 512 512'
             x={props.x || 0}
             y={props.y || 0}
             width={props.size || DEFAULT_SIZE}
             height={props.size}
             xmlns="http://www.w3.org/2000/svg"
             style={props.style}>
            <path
                d='M444.125,135.765L149.953,429.937l-67.875-67.875L376.219,67.859L444.125,135.765z M444.125,0l-45.281,45.234l67.906,67.906 L512,67.859L444.125,0z M66.063,391.312L0,512l120.703-66.063L66.063,391.312z'/>
        </svg>
    );
};
