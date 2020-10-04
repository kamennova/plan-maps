import React, { useState, CSSProperties } from 'react';

type ButtonProps = {
    children: string | JSX.Element | (JSX.Element | string)[],
    style?: CSSProperties,
    onClick?: () => void,
};

export const Button = (props: ButtonProps) => {
    const [isHover, updateIsHover] = useState(false);

    return (
        <button style={{
            position: 'relative',
            display: 'inline-block',
            padding: '8px',
            minWidth: '110px',
            backgroundColor: 'white',
            border: '1px solid darkblue',
            outline: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            transition: '0.2s linear box-shadow',
            boxShadow: isHover ? '0 0 10px #afd3ff' : undefined,
            userSelect: 'none',
            fontSize: '14px',
            color: 'darkblue',

            ...props.style,
        }}
                onMouseEnter={() => {
                    updateIsHover(true);
                }}
                onMouseLeave={() => updateIsHover(false)}
                onClick={props.onClick}>{props.children}</button>
    );
};
