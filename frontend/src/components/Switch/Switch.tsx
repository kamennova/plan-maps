import React, { useState } from 'react';

type SwitchProps = {
    label?: string,
    labelOnTheRight?: string,
    isChecked?: boolean,
    onSwitch?: (isChecked: boolean) => void,
};

export const Switch = (props: SwitchProps) => {
    const [ isChecked, updateIsChecked ] = useState(props.isChecked || false);

    return (
        <div style={{ userSelect: 'none', display: 'inline-block' }}>
            { props.label }
            <div style={{
                height: '20px',
                display: 'inline-block',
                width: '42px',
                borderRadius: '10px',
                position: 'relative',
                verticalAlign: 'middle',
                boxShadow: 'inset 0px 0px 3px 1px rgba(0, 0, 0, 0.3)',
                margin: '0 10px',
            }} onClick={ () => {
                updateIsChecked(!isChecked);
                if (props.onSwitch !== undefined) {
                    props.onSwitch(!isChecked);
                }
            }}>
                <div style={{
                    display: 'block',
                    height: '24px',
                    width: '24px',
                    borderRadius: '12px',
                    border: '1px solid #DDD',
                    position: 'absolute',
                    top: '-2px',
                    left: isChecked ? '20px' : '-2px',
                    boxShadow: '0px 0px 3px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    transition: 'left 0.3s ease-in-out',
                }} />
            </div>
            { props.labelOnTheRight }
        </div>
    );
};
