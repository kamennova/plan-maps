import { Container } from 'inversify';
import { Database } from '../database';
import types from '../types';
import { SyncResponse, SyncableAction, SyncableActionType, AddChartNodeAction } from 'flowcharts-common';
import { SyncRequest } from './types';
import {
    getAddNodeHandlerByType,
    updateTaskStateHandler,
    updateGoalHandler,
    revokeAccessHandler,
    grantAccessHandler,
    setBackgroundHandler,
} from './chart';
import { setProfilePictureHandler } from './user';
import { deleteChartHandler } from './userChart';

type SyncHandler = (action: SyncableAction) => Promise<void>;

export default (container: Container) => {
    const database = container.get<Database>(types.Database);

    const syncHandler = async (req: SyncRequest): Promise<SyncResponse> => {
        for (const action of req.body.actions) {
            const handler = getSyncHandlerByType(database, action.type);

            if (handler === undefined) {
                console.error('Unknown sync action type:', action);
                continue;
            }

            await handler(action);
        }

        return { status: 200 };
    };

    return {
        syncHandler,
    };
};

const getSyncHandlerByType = (database: Database, type: SyncableActionType): SyncHandler | undefined => {
    switch (type) {
        case 'DELETE_CHART':
            return deleteChartHandler(database) as SyncHandler;
        case 'ADD_NODE':
            return addNodeHandler(database) as SyncHandler;
        case 'UPDATE_TASK_STATE_FOR_NODE':
            return updateTaskStateHandler(database) as SyncHandler;
        case 'UPDATE_GOAL':
            return updateGoalHandler(database) as SyncHandler;
        case 'REVOKE_ACCESS':
            return revokeAccessHandler(database) as SyncHandler;
        case 'GRANT_ACCESS':
            return grantAccessHandler(database) as SyncHandler;
        case 'SET_BACKGROUND':
            return setBackgroundHandler(database) as SyncHandler;
        case 'SET_PROFILE_PICTURE':
            return setProfilePictureHandler(database) as SyncHandler;
        default:
            return undefined;
    }
};

const addNodeHandler = (database: Database) => async (action: AddChartNodeAction): Promise<void> =>
    await getAddNodeHandlerByType(database, action.node.type)(action);