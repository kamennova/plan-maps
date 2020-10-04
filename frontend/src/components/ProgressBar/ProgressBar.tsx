import React, { CSSProperties } from 'react';

type ProgressBarProps = {
    completed: number,
    total: number,
    style?: CSSProperties,
    totalBg?: string,
    completedBg?: string,
};

export const ProgressBar = (props: ProgressBarProps) => {
    const percentage = props.total === 0 ? 0 : Math.floor(props.completed / props.total * 100);

    return (
        <span style={{
            display: 'block',
            width: '100%',
            height: '6px',
            backgroundColor: props.totalBg !== undefined ? props.totalBg : '#e2e2e2',
            borderRadius: '3px',
            ...props.style
        }}>
            <span style={{
                display: 'block',
                width:  percentage + '%',
                height: 'inherit',
                backgroundColor: props.completedBg !== undefined ? props.completedBg : '#7f72ef',
                boxShadow: '0 0 4px rgba(14, 84, 17, 0.35)',
                borderRadius: 'inherit',
            }}/>
        </span>
    );
};
