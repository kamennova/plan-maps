import { inject, injectable } from 'inversify';
import jwt, { VerifyOptions, TokenExpiredError } from 'jsonwebtoken';

import { User } from '../';
import { Database } from '../../database';
import types from '../../types';
import { JwtToken } from './';
import { AuthTokenDecoder } from './authTokenDecoder';
import { JwtConfig } from './jwtConfig';

/**
 * This decodes jwt tokens.
 */
@injectable()
export class JwtTokenDecoder implements AuthTokenDecoder {

    /**
     * @param database is required to load user details
     */
    constructor(
        @inject(types.Database) private database: Database,
        @inject(types.AppSecret) private appSecret: string,
        @inject(types.JwtConfig) private jwtConfig: JwtConfig,
    ) {}

    public decodeToken = (token: string): Promise<User | undefined> => new Promise((resolve, reject) => {
        jwt.verify(token, this.appSecret, this.jwtConfig as VerifyOptions,
            (error: jwt.VerifyErrors, decoded: string | object) => {
            if (error) {
                if (error instanceof TokenExpiredError) {
                    resolve(undefined);
                    return;
                }

                reject(error);
            }

            const userId = (decoded as JwtToken).userId;
            this.database.findUserById(userId).then(resolve).catch(reject);
        });
    })
}
