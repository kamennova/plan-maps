import https from 'https';

import { Container } from 'inversify';

import { AuthResult, GoogleAuthResponse } from '../../../common/api';
import { withFieldsValidation } from '../api';
import { Database } from '../database';
import types from '../types';
import { alphanumericStringValidator, combinedValidator, lengthValidator, notUndefinedValidator } from '../validation';
import { AuthError } from './authError';
import { PasswordHasher } from './hashing';
import { GoogleAuthRequest, LoginRequest, SignUpRequest } from './requests';
import userDoesNotExistValidator from './validation/userDoesNotExistValidator';

const usernameLengthValidator = lengthValidator('Username', 6);
const passwordLengthValidator = lengthValidator('Password', 8);

type GoogleAuthResult = {
    id: string,
};

export default (container: Container) => {
    const database = container.get<Database>(types.Database);
    const passwordHasher = container.get<PasswordHasher>(types.PasswordHasher);
    const usernameValidator = combinedValidator(
        notUndefinedValidator('username'),
        usernameLengthValidator,
        alphanumericStringValidator('Username'),
    );
    const passwordValidator = combinedValidator(
        notUndefinedValidator('password'),
        passwordLengthValidator,
    );

    const signUp = withFieldsValidation(async (req: SignUpRequest): Promise<AuthResult> => {
        const passwordHash = await passwordHasher.hash(req.body.password);
        const user = await database.createUser(req.body.username, passwordHash);
        const authToken = await user.generateAuthToken();

        return { status: 200, authToken, user: user.toUserInfo() };
    }, {
        username: combinedValidator(
            usernameValidator,
            userDoesNotExistValidator(database),
        ),
        password: passwordValidator,
    });

    const login = withFieldsValidation(async (req: LoginRequest): Promise<AuthResult | AuthError> => {
        const user = await database.findUserByUsername(req.body.username);
        if (user === undefined) {
            // This check cannot be performed by validator, as User instance is needed later.
            return {
                status: 400,
                message: `User with username "${req.body.username}" was not found.`,
            };
        }

        if (!await user.verifyPassword(req.body.password)) {
            return {
                status: 400,
                message: 'Invalid password.',
            };
        }

        const authToken = await user.generateAuthToken();

        return { status: 200, authToken, user: user.toUserInfo() };
    }, {
        username: notUndefinedValidator('username'),
        password: notUndefinedValidator('password'),
    });

    const googleAuth = withFieldsValidation(async (req: GoogleAuthRequest): Promise<GoogleAuthResponse | AuthError> => {
        const account_info = await get_account_info_by_token(req.body.accessToken);
        const user = await database.findUserByGoogleId(account_info.id);

        if (user === undefined) {
            // Signup
            if (req.body.username === undefined || req.body.username.length === 0) {
                return { status: 200, usernameIsNotSetYet: true };
            }

            const newUser = await database.createGoogleAuthUser(req.body.username, account_info.id);
            const authToken = await newUser.generateAuthToken();
            return { status: 200, authToken, user: newUser.toUserInfo(), usernameIsNotSetYet: false };
        }

        const authToken = await user.generateAuthToken();
        return { status: 200, authToken, user: user.toUserInfo(), usernameIsNotSetYet: false };
    }, {
        accessToken: notUndefinedValidator('accessToken'),
    });

    return { signUp, login, googleAuth };
};

async function get_account_info_by_token(access_token: string): Promise<GoogleAuthResult> {
    return new Promise((resolve, _) => {
        https.get({
            hostname: 'www.googleapis.com',
            path: '/oauth2/v1/userinfo?alt=json',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }, response => {
            let result = '';
            response.on('data', chunk => {
                result += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(result) as GoogleAuthResult);
            });
        });
    });
}