import { UserInfo } from '../auth';

/**
 * Values returned on successful auth.
 *
 * If auth failed, AuthError is returned.
 */
export type AuthResult = {
    status: 200,
    authToken: string,
    user: UserInfo,
};

export type GoogleAuthResponse = {
    status: 200,
    usernameIsNotSetYet: boolean,
    authToken?: string,
    user?: UserInfo,
};
