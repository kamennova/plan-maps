import React from "react";
import { CloseButton } from "../../components/CloseButton";

export type TipProps = {
    content: JSX.Element | string;
    onDismiss: () => void,
};

export const Tip = (props: TipProps) => {
    return (
        <p style={{
            position: 'relative',
            margin: 'auto 0 0',
            padding: '10px',
            fontSize: '13px',
            color: '#3d0aa0',
            backgroundColor: '#f4eeff',
            border: '1px solid #6517ff',
            borderRadius: '12px',
            lineHeight: 1.4,
        }}>
            <CloseButton fill='#6517ff' onClick={props.onDismiss} size='10px' style={{ top: '4px' }}/>
            <h4 style={{ margin: '0 0 10px', fontWeight: 'bold' }}>Tip:</h4>
            { props.content }
        </p>);
};
