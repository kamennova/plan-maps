import React, { useState } from 'react';
import { InputErrorAlert } from "../../components/InputErrorAlert";
import { history } from '../../store';
import { AuthFormInput } from '../components/AuthFormInput';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { mapAuthStateToProps, mapAuthDispatchToProps, AuthProps, doAuth, doGoogleAuth } from '../common';
import { connect } from 'react-redux';
import { SignInWithGoogle } from '../components/SignInWithGoogle';
import { Button } from '../../components/Button';

export const SignupComponent = (props: AuthProps) => {
    const [ username, updateUsername ] = useState('');
    const [ password, updatePassword ] = useState('');
    const [ passwordFieldIsHidden, updatePasswordFieldIsHidden ] = useState(false);
    const [ errorMessage, updateErrorMessage ] = useState('');

    return (
        <div className="form-container authorization">
            <h1 className="page-title">Sign Up</h1>

            <div className="auth-form">
                <AuthFormInput label='Username' type='text' value={username} onChange={updateUsername} />
                {
                    !passwordFieldIsHidden ? (
                        <AuthFormInput label='Password' type='password' value={password} onChange={updatePassword} />
                    ) : undefined
                }

                { errorMessage !== '' ? <InputErrorAlert>{errorMessage}</InputErrorAlert> : undefined }

                <AuthSubmitButton label='Sign Up' onClick={
                    () => doAuth('signup', username, password, history, updateErrorMessage, props.updateUserInfo)
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

export const Signup = connect(mapAuthStateToProps, mapAuthDispatchToProps)(SignupComponent);
