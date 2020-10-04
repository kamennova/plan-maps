import { AuthorizedApiRequest } from './authorizedApiRequest';

export type UploadProfilePictureRequest = AuthorizedApiRequest & {
    body: {},
    params: {},
    rawBody: Buffer
};
