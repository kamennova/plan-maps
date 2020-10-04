import React, { CSSProperties, useState } from 'react';

export type InputProps = {
    value?: string,
    type?: string | undefined,
    placeholder?: string,
    style?: CSSProperties,
    onChange?: (newValue: string) => void,
};

export const Input = (props: InputProps) => {
    const [isHover, updateIsHover] = useState(false);
    const [isActive, updateIsActive] = useState(false);

    return (
        <input
            style={{
                padding: '5px 10px',
                letterSpacing: '0.02em',
                border: '1px solid',
                borderRadius: '3px',
                transition: '0.2s linear border-color',
                outline: 'none',
                lineHeight: '12pt',

                borderColor: (isHover || isActive) ? '#b300b3' : '#dedede',

                ...props.style,
            }}
            value={props.value}
            placeholder={props.placeholder}
            type={props.type}
            onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e.currentTarget.value);
                }
            }}
            onMouseEnter={() => updateIsHover(true)}
            onMouseLeave={() => updateIsHover(false)}
            onFocus={() => updateIsActive(true)}
            onBlur={() => updateIsActive(false)}/>
    )
};
