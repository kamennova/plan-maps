import { AuthorizedApiRequest } from '../auth/authorizedApiRequest';
import { SyncableAction } from 'flowcharts-common';

export type SyncRequest = AuthorizedApiRequest & {
    body: {
        actions: SyncableAction[],
    }
};