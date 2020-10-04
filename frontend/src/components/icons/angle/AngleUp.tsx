import React from 'react';
import { IconProps, DEFAULT_SIZE } from '../iconProps';

export const AngleUp = (props: IconProps) => {
    return (
        <svg 
            width={props.size || DEFAULT_SIZE} 
            height={props.size || DEFAULT_SIZE} 
            viewBox="0 0 1792 1792" 
            xmlns="http://www.w3.org/2000/svg"
            style={props.style}>
            <path d="M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z"/>
        </svg>
    );
};