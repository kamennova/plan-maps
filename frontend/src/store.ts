import { routerMiddleware } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger';

import { rootReducer } from './reducer';
import { api_request } from './api';
import { SyncResponse } from 'flowcharts-common';
import { REMOVE_FROM_SYNC_QUEUE } from './types/actions';

export const history = createHistory();

const appRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => applyMiddleware(appRouterMiddleware, createLogger());

export const store = createStore(
    rootReducer(history), JSON.parse(localStorage.state || '{}'), composeWithDevTools(getMiddleware()),
);

store.subscribe(() => {
    localStorage.state = JSON.stringify(store.getState());
});

const SYNC_TIMEOUT = 60 * 1000;
let syncInProgress = false;
let syncTimeout = undefined as number | undefined;
store.subscribe(() => {
    if (syncInProgress) {
        return;
    }

    const syncQueue = [ ...store.getState().sync.queue ]; // copy sync queue, so we surely know what we are syncing
    if (syncQueue.length === 0) {
        return;
    }

    syncInProgress = true;
    
    const syncRequestBody = {
        actions: syncQueue.map(element => element.action),
    };

    try {
        api_request<SyncResponse>('sync', 'POST', syncRequestBody).then((res: SyncResponse) => {
            window.clearTimeout(syncTimeout);
            
            if (res.status === 200) {
                store.dispatch({ type: REMOVE_FROM_SYNC_QUEUE, ids: syncQueue.map(element => element.id) });
            } else {
                console.error('failed to sync:', res);
            }

            syncInProgress = false;
        }).catch(e => {
            console.error('sync request error:', e);
            syncInProgress = false;
        });
    } catch (e) {
        console.error('sync request error:', e);
        syncInProgress = false;
    }

    syncTimeout = window.setTimeout(() => {
        syncInProgress = false;
        console.error('sync timeout');
    }, SYNC_TIMEOUT);
});