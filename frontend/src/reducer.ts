import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

import user from './reducers/user';
import modal from './reducers/modal';
import chart from './reducers/chart';
import userCharts from './reducers/userCharts';
import sync from './reducers/sync';
import tip from './reducers/tip';

export const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    user,
    modal,
    chart,
    userCharts,
    sync,
    tip,
});
