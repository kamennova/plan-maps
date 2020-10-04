import {Container} from 'inversify';
import {Database} from '../database';
import types from '../types';
import { GetUserInfoResponse } from 'flowcharts-common';
import { GetUserInfoByIdRequest, GetUserInfoByUsernameRequest } from './types';

export default (container: Container) => {
    const database = container.get<Database>(types.Database);

    const getUserInfoByUserId = async (req: GetUserInfoByIdRequest): Promise<GetUserInfoResponse> => {
        const user = await database.findUserById(parseInt(req.params.user_id));
        
        if (user === undefined) {
            return { status: 404 };
        }

        return { status: 200, user: user.toUserInfo() };
    };

    const getUserInfoByUsername = async (req: GetUserInfoByUsernameRequest): Promise<GetUserInfoResponse> => {
        const user = await database.findUserByUsername(req.params.username);
        
        if (user === undefined) {
            return { status: 404 };
        }

        return { status: 200, user: user.toUserInfo() };
    };

    return {
        getUserInfoByUserId,
        getUserInfoByUsername,
    }
}