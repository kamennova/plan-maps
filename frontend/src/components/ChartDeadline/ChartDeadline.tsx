import React, { CSSProperties } from 'react';

import humanizeDuration from 'humanize-duration';

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'
];

type ChartDeadlineProps = {
    deadline: Date,
    style?: CSSProperties
};

export const ChartDeadline = (props: ChartDeadlineProps) => {
    const difference = props.deadline.getTime() - new Date().getTime();

    return (
        <div style={{
            fontSize: '11pt',
            color: 'rgb(96, 96, 96)',
            ...props.style
        }}>
            {'Deadline: '}
            {props.deadline.getDate().toString().padStart(2, '0')} {MONTH_NAMES[props.deadline.getMonth()]} {props.deadline.getFullYear()}
            {' | '}
            {humanizeDuration(difference, { largest: 1 })} {difference > 0 ? 'left' : 'late'}
        </div>
    );
};
