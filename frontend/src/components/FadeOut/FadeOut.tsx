import React from 'react';

type FadeOutProps = {
    zIndex?: number,
};

export const FadeOut = (props: FadeOutProps) => {
    return (
        <div style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            zIndex: props.zIndex || 100
        }}></div>
    );
};