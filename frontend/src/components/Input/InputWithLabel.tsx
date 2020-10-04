import React, { CSSProperties } from 'react';
import { Input, InputProps } from './Input';

export type InputWithLabelProps = InputProps & {
    label: string,
    style?: CSSProperties,
    inputStyle?: CSSProperties,
    labelStyle?: CSSProperties,
};

export const InputWithLabel = (props: InputWithLabelProps) => {
    return (
        <div style={props.style}>
            <label style={{ padding: '4px 0', lineHeight: '25px', ...props.labelStyle }}>{props.label}</label>
            <Input { ...props } style={props.inputStyle} />
        </div>
    );
};