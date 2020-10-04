import React from 'react';

type AuthFormInputProps = {
    label: string,
    type: string,
    value: string,
    onChange: (updatedValue: string) => void,
};

export const AuthFormInput = (props: AuthFormInputProps) => {
    return (
        <p className="form-control">
            <label className="field-label">{ props.label }</label><br />
            <input
                className="form-field"
                type={ props.type }
                style={{
                    lineHeight: '8pt',
                }}
                value={ props.value }
                onChange={ (e) => props.onChange(e.currentTarget.value) }
            />
        </p>
    );
};
