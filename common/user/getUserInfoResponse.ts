import { UserInfo } from '../auth';

export type GetUserInfoResponse = {
    status: 200,
    user: UserInfo,
} | {
    status: 404,
};