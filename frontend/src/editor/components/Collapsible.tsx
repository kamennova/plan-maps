import React, { useState, CSSProperties } from 'react';
import { AngleUp, AngleDown } from '../../components/icons';

type CollapsibleProps = {
    title: string,
    children: string | JSX.Element | (JSX.Element | Element | undefined)[];
};

export const Collapsible = (props: CollapsibleProps) => {
    const [isCollapsed, updateIsCollpased] = useState(false);

    const body = (
        <div style={{ marginTop: '10px' }}>
            {props.children}
        </div>
    );

    const angleStyle: CSSProperties = {
        position: 'absolute',
        right: '0',
        top: '0'
    };

    return (
        <section>
            <div style={{ cursor: 'pointer', position: 'relative', paddingRight: '20px' }}
                 onClick={() => updateIsCollpased(!isCollapsed)}>
                <h3 style={{ fontSize: '16px' }}>{props.title}</h3>

                {isCollapsed ? <AngleDown size='24px' style={angleStyle}/> : <AngleUp size='24px' style={angleStyle}/>}
            </div>
            {!isCollapsed ? body : undefined}
        </section>
    )
};
