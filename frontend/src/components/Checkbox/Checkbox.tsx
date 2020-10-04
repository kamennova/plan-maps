import React, { CSSProperties, useState } from 'react';

type CheckboxProps = {
    value?: boolean,
    style?: CSSProperties,
    onChange?: (newValue: boolean) => void,
};

export const Checkbox = (props: CheckboxProps) => {
    const [ isChecked, updateIsChecked ] = useState(props.value);
    const [ isHover, updateIsHover ] = useState(false);

    return (
        <div 
            style={{ position: 'relative' }}
            onMouseEnter={ () => updateIsHover(true) }
            onMouseLeave={ () => updateIsHover(false) }
            onClick={ () => {
                updateIsChecked(!isChecked);
                if (props.onChange) {
                    props.onChange(!isChecked);
                }
            } }>
                <input
                    style = { { 
                        height: '25px',
                        width: '25px',
                        padding: '5px 10px',
                        border: '1px solid',
                        borderRadius: '3px',
                        transition: '0.2s linear border-color',
                        outline: 'none',

                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        backgroundColor: 'white',
                        borderColor: isHover ? '#b300b3' : '#dedede',
                        cursor: 'pointer',

                        ...props.style,
                    } }
                    checked={isChecked}
                    type='checkbox'
                    onChange={ () => {
                        updateIsChecked(!isChecked);
                        if (props.onChange) {
                            props.onChange(!isChecked);
                        }
                    } } />
                { isChecked ? (
                    <span style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '18pt',
                        color: '#b300b3',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}>✓</span>
                ) : undefined }
        </div>
    )
};