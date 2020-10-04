import React, { useState } from 'react';
import { connect } from 'react-redux';
import { InputErrorAlert } from "../../components/InputErrorAlert";
import { history } from '../../store';
import { AuthFormInput } from '../components/AuthFormInput';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { AuthProps, doAuth, mapAuthStateToProps, mapAuthDispatchToProps, doGoogleAuth } from '../common';
import { SignInWithGoogle } from '../components/SignInWithGoogle';
import { Button } from '../../components/Button';

export const LoginComponent = (props: AuthProps) => {
    const [ username, updateUsername ] = useState('');
    const [ password, updatePassword ] = useState('');
    const [ passwordFieldIsHidden, updatePasswordFieldIsHidden ] = useState(false);
    const [ errorMessage, updateErrorMessage ] = useState('');

    return (
        <div className="form-container authorization">
            <h1 className="page-title">Log in</h1>

            <div className="auth-form">
                <AuthFormInput label='Username' type='text' value={username} onChange={updateUsername} />
                {
                    !passwordFieldIsHidden ? (
                        <AuthFormInput label='Password' type='password' value={password} onChange={updatePassword} />
                    ) : undefined
                }

                { errorMessage !== '' ? <InputErrorAlert>{errorMessage}</InputErrorAlert> : undefined }

                <AuthSubmitButton label='Login' onClick={
                    () => doAuth('login', username, password, history, updateErrorMessage, props.updateUserInfo)
                } />

                <SignInWithGoogle style={{
                    marginTop: '20px',
                    width: '100%',
                    height: 'auto',
                }} onAuthDone={ accessToken => doGoogleAuth(username, accessToken, history, updateErrorMessage, props.updateUserInfo, () => {
                    updateErrorMessage('Please choose a username');
                    updatePasswordFieldIsHidden(true);
                }) }/>

                { passwordFieldIsHidden ? (
                    <Button onClick={() => {
                        updateErrorMessage('');
                        updatePasswordFieldIsHidden(false);
                    }}>Back</Button>
                ) : undefined }
            </div>
        </div>
    );
};

export const Login = connect(mapAuthStateToProps, mapAuthDispatchToProps)(LoginComponent);
