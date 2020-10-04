import { ApiRequest } from 'flowcharts-common';
import { User } from './user';

export type AuthorizedApiRequest = ApiRequest & {
    user: User,
};
