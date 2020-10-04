import React from 'react';

type TaskProps = {
    name: string,
};

export const Task = (props: TaskProps) => {
    return (
        <div style={{
            padding: '8px 0',
            fontSize: '16px',
        }}>{props.name}</div>
    );
};
