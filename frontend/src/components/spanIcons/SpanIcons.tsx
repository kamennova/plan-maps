import React, { CSSProperties } from "react";

type SpanIconProps = {
    fill: string,
    sickness: string,
    size: string,
    style?: CSSProperties
}

const centeredStyle = {
    margin: '0 auto',
    right: '0',
    bottom: '0'
};

const SpanIconBar = (props: { style?: CSSProperties }) => {
    return (
        <span style={{
            position: 'absolute',
            display: 'block',
            left: '0',
            top: '0',
            ...props.style
        }}/>

    );
};

export const PlusSpanIcon = (props: SpanIconProps) => {
    return (
        <span style={{
            position: 'relative',
            display: 'inline-block',
            width: props.size,
            height: props.size,
            ...props.style
        }}>
            <SpanIconBar
                style={{ backgroundColor: props.fill, width: props.sickness, height: props.size, ...centeredStyle }}/>
            <SpanIconBar style={{
                backgroundColor: props.fill, width: props.sickness, height: props.size,
                transform: 'rotate(90deg)',
                ...centeredStyle
            }}/>
        </span>
    );
};

export const CircleIcon = (props: SpanIconProps) => (
    <span style={{
        display: 'block',
        width: props.size,
        height: props.size,
        borderRadius: '50%',
        border: `${props.sickness}px solid ${props.fill}`,
        ...props.style
    }} />
);

