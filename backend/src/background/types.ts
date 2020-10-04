import { AuthorizedApiRequest } from '../auth/authorizedApiRequest';

export type UploadBackgroundRequest = AuthorizedApiRequest & {
    body: {},
    params: {},
    rawBody: Buffer
};