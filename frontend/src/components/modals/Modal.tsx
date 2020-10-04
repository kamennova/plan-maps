import React from 'react';
import { CloseButton } from "../CloseButton";

type ModalProps = {
    children: string | JSX.Element;
    onDismiss: () => void,
};

export const Modal = (props: ModalProps) => {
    return (
        <article style={{
            width: '500px',
            height: 'fit-content',
            zIndex: 999,
            borderRadius: '4px',
            position: 'fixed',
            margin: 'auto',
            left: 0,
            right: 0,
            top: '420px',
            transform: 'translateY(-300px)',
            padding: '20px',
            backgroundColor: 'white',
            border: '1px solid #e4e4e4',
        }}>
            <CloseButton onClick={props.onDismiss} style={{top: '7px', right: '8px'}}/>
            {props.children}
        </article>
    );
};
