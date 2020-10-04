import React, {CSSProperties, useState } from "react";

type DropdownProps = {
    header: JSX.Element | JSX.Element[],
    options: JSX.Element[],
    style?: CSSProperties,
    listStyle?: CSSProperties,
}

export const Dropdown = (props: DropdownProps) => {
    const [isShown, updateIsShown] = useState(false);

    return (
        <div onMouseEnter={()=>updateIsShown(true)} onMouseLeave={()=>updateIsShown(false)} style={{
            position: 'relative',
            ...props.style
        }}>
            {props.header}

            <div style={{
                position: 'absolute',
                left: '0',
                top: '0',
                display: isShown ? 'block' : 'none',
                padding: '10px 15px 15px',
                backgroundColor: 'white',
                border: '1px solid lightgrey',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
                ...props.listStyle,
            }}>
                {props.options}
            </div>

        </div>
    );
};
