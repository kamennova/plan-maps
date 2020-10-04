import React from 'react';

type AuthErrorMessageProps = {
    flow: string,
    message: string,
};

export const AuthErrorMessage = (props: AuthErrorMessageProps) => {
    return (
        <div className="auth-notification error">
            <h2 className="notification-title">{ props.flow } error:</h2>
            <p className="notification-message">{ props.message }</p>
        </div>
    );
};
