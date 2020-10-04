import React, { useState, CSSProperties } from 'react';

type SelectProps = {
    value: string | number,
    options: SelectOption[],
    style?: CSSProperties,
    onChange?: (newValue: string | number) => void,
};

export type SelectOption = {
    value: string | number,
    label: string,
}

export const Select = (props: SelectProps) => {
    const [ isHover, updateIsHover ] = useState(false);
    const [ isActive, updateIsActive ] = useState(false);

    return (
        <select
            style = { { 
                backgroundColor: 'white',
                padding: '5px 10px',
                letterSpacing: '0.02em',
                border: '1px solid',
                borderRadius: '3px',
                transition: '0.2s linear border-color',
                outline: 'none',
                lineHeight: '12pt',

                borderColor: (isHover || isActive) ? '#b300b3' : '#dedede',

                ...props.style,
            } }
            value={props.value}
            onChange={ (e) => {
                if (props.onChange) {
                    props.onChange(e.currentTarget.value);
                }
            } }
            onMouseEnter={ () => updateIsHover(true) }
            onMouseLeave={ () => updateIsHover(false) }
            onFocus={ () => updateIsActive(true)} 
            onBlur={ () => updateIsActive(false) }>
            { props.options.map(option => (<option value={option.value}>{ option.label }</option>)) }
        </select>
    )
};