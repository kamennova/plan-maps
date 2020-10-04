import { classToPlain } from 'class-transformer';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { JwtToken } from '.';
import types from '../../types';
import { Authorizable } from '../authorizable';
import { AuthTokenGenerator } from './authTokenGenerator';
import { JwtConfig } from './jwtConfig';

@injectable()
export class JwtTokenGenerator implements AuthTokenGenerator {

    constructor(
        @inject(types.AppSecret) private appSecret: string,
        @inject(types.JwtConfig) private jwtConfig: JwtConfig,
    ) {}

    /**
     * @param user User to issue token to.
     * @returns string string representation of jwt.
     */
    public generateToken = (user: Authorizable): Promise<string> => new Promise((resolve, reject) => {
        jwt.sign(classToPlain(new JwtToken(user)), this.appSecret, this.jwtConfig, (error, token) => {
            if (error) {
                reject(error);
            }
            resolve(token);
        });
    })
}
