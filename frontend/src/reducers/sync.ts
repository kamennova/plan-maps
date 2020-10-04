import { SyncableAction, SYNCABLE_ACTIONS } from 'flowcharts-common';
import uuid from 'uuid';
import { UserLogoutAction } from './user';

export type SyncQueueElement = {
    id: string,
    action: SyncableAction,
};

export type SyncState = {
    queue: SyncQueueElement[],  
};

export type RemoveFromSyncQueueAction = {
    type: 'REMOVE_FROM_SYNC_QUEUE',
    ids: string[],
};

export type SyncAction = UserLogoutAction | SyncableAction | RemoveFromSyncQueueAction;

const defaultState: SyncState = {
    queue: [],
};

export default (state = defaultState, action: SyncAction): SyncState => {
    if (action.type === 'LOGOUT') {
        return {
            ...state,
            queue: []
        };
    }

    if (action.type === 'REMOVE_FROM_SYNC_QUEUE') {
        return {
            ...state,
            queue: state.queue.filter(element => action.ids.indexOf(element.id) === -1),
        };
    }

    if (SYNCABLE_ACTIONS.indexOf(action.type) === -1) {
        return state;
    }

    return {
        ...state,
        queue: [
            ...state.queue,
            {
                id: uuid(),
                action
            }
        ]
    };
};