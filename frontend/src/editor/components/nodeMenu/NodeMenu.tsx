import React, { CSSProperties, ReactNode } from "react";
import { Position } from "flowcharts-common";

type NodeMenuProps = {
    children: JSX.Element[],
    hideMenu?: () => void,
    closeMenu?: () => void,
    width?: number,
    style?: CSSProperties,
    show?: boolean,
    pos?: Position,
}

export const NodeMenu = (props: NodeMenuProps) => {
    return (
        <div style={{
            position: 'absolute',
            left: `${(props.pos?.x || 0) - (props.width || 0) / 2}px`,
            top: `${(props.pos?.y || 0) - 80}px`,
            display: 'flex',
            width: props.width + 'px',
            height: '60px',
            alignItems: 'space-between',
            flexGrow: 0,
            padding: '8px',
            backgroundColor: 'white',
            border: '1px solid lightgrey',
            borderRadius: '2px',
            ...props.style
        }} onClick={props.hideMenu}>
            <ArrowDownSpan background='lightgrey' size='11px' style={{
                position: 'absolute',
                left: '0',
                right: '0',
                bottom: '-11px',
            }}>
                <ArrowDownSpan background='white' size='9px' style={{ marginLeft: '-9px' }}/>
            </ArrowDownSpan>
            {props.children}
        </div>
    );
};

const ArrowDownSpan = (props: { background: string, size: string, style?: CSSProperties, children?: ReactNode }) => {
    return (<span style={{
        width: '0',
        height: '0',
        margin: '0 auto',
        borderLeft: `${props.size} solid transparent`,
        borderRight: `${props.size} solid transparent`,
        borderTop: `${props.size} solid ${props.background}`,
        ...props.style
    }}>
        {props.children}
    </span>);
};
