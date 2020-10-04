import React from 'react';

type AuthSubmitButtonProps = {
    label: string,
    onClick: () => void,
};

export const AuthSubmitButton = (props: AuthSubmitButtonProps) => {
    return (
        <button className="btn submit-btn" onClick={props.onClick}>{ props.label }</button>
    );
};
