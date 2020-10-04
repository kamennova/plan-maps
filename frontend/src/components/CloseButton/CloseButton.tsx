import React, { CSSProperties } from "react";
import { PlusSpanIcon } from "../spanIcons";

type CloseButtonProps = {
    onClick: () => void,
    fill?: string,
    size?: string,
    style?: CSSProperties,
}

export const CloseButton = (props: CloseButtonProps) => (
    <span style={{
        position: 'absolute',
        right: '0px',
        top: '10px',
        fontSize: '0',
        padding: '10px',
        cursor: 'pointer',
        ...props.style
    }}
          onClick={props.onClick}>
                Close
                <PlusSpanIcon fill={props.fill || 'black'} sickness='2px' size={props.size || '14px'}
                              style={{ transform: 'rotate(45deg)' }}/>
    </span>
);
