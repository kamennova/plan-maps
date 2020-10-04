import React from 'react';
import { IconProps, DEFAULT_SIZE } from "./iconProps";

export const CircleThin = (props: IconProps) => {
    return (
        <svg
            width={props.size || DEFAULT_SIZE} 
            height={props.size || DEFAULT_SIZE} 
            viewBox="0 0 1792 1792" 
            xmlns="http://www.w3.org/2000/svg"
            style={props.style}>
                <path d="M896 256q-130 0-248.5 51t-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5-51-248.5-136.5-204-204-136.5-248.5-51zm768 640q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
        </svg>   
    )
};