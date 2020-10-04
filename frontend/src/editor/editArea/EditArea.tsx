import React from 'react';

type EditAreaProps = {
    children: (Element | JSX.Element | undefined)[],
};

export const EditArea = (props: EditAreaProps) => {
    return (
        <div style={{
            display: 'fixed',
            width: '100%',
            backgroundColor: '#f8f8f8',
            position: 'relative',
        }}>
            { props.children }
        </div>
    )
};
