import { AuthorizedApiRequest } from '../auth/authorizedApiRequest';

export type GetUserInfoByIdRequest = AuthorizedApiRequest & {
    body: {},
    params: {
        user_id: string,
    }
};

export type GetUserInfoByUsernameRequest = AuthorizedApiRequest & {
    body: {},
    params: {
        username: string,
    }
};