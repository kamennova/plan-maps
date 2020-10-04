import React from 'react';
import { IconProps, DEFAULT_SIZE } from './iconProps';

export const EllipsisV = (props: IconProps) => {
    return (
        <svg viewBox="0 0 1792 1792"
            x={props.x || 0}
            y={props.y || 0}
            width={props.size || DEFAULT_SIZE}
            height={props.size || DEFAULT_SIZE} 
            xmlns="http://www.w3.org/2000/svg"
            style={props.style}
            onClick={props.onClick}>
                <path d="M1088 1248v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68z"/>
        </svg>
    );
};