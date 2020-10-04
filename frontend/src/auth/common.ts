import { UserInfo, AuthResult, ApiError, GoogleAuthResponse } from 'flowcharts-common';
import { UserAction } from '../reducers/user';
import { UPDATE_USER_INFO } from '../types/actions';
import { Dispatch } from 'react';
import { api_request } from '../api';
import { History } from 'history';

export type AuthMethod = 'signup' | 'login';

export type AuthProps = {
    updateUserInfo: (user: UserInfo) => void,
};

export const mapAuthStateToProps = () => ({});

export const mapAuthDispatchToProps = (dispatch: Dispatch<UserAction>) => ({
    updateUserInfo: (user: UserInfo) => dispatch({ type: UPDATE_USER_INFO, user }),
});

export const doAuth = (
    method: AuthMethod,
    username: string,
    password: string,
    history: History,
    updateErrorMessage: (errorMessage: string) => void,
    updateUserInfo: (user: UserInfo) => void,
) => {
    api_request<AuthResult | ApiError>(method, 'POST', { username, password })
        .then((res) => {
            if (res.status !== 200) {
                const error = res as ApiError;
                updateErrorMessage(error.message);
                return;
            }

            const authResult = res as AuthResult;
            localStorage.authToken = authResult.authToken;
            updateUserInfo(authResult.user);
            history.push('/home');
        });
};

export const doGoogleAuth = (
    username: string | undefined,
    accessToken: string,
    history: History,
    updateErrorMessage: (errorMessage: string) => void,
    updateUserInfo: (user: UserInfo) => void,
    onUsernameIsRequested: () => void
) => {
    api_request<GoogleAuthResponse | ApiError>('google_auth', 'POST', { username, accessToken })
        .then((res) => {
            if (res.status !== 200) {
                const error = res as ApiError;
                updateErrorMessage(error.message);
                return;
            }

            if ((res as GoogleAuthResponse).usernameIsNotSetYet) {
                onUsernameIsRequested();
                return;
            }

            const authResult = res as AuthResult;
            localStorage.authToken = authResult.authToken;
            updateUserInfo(authResult.user);
            history.push('/home');
        });
};