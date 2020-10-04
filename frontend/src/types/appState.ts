import { ModalState } from '../reducers/modal';
import { ChartsState } from '../reducers/chart';
import { UserChartsState } from '../reducers/userCharts';
import { UserState } from '../reducers/user';
import { SyncState } from '../reducers/sync';
import { TipState } from '../reducers/tip';

export type AppState = {
    user: UserState,
    modal: ModalState,
    chart: ChartsState,
    userCharts: UserChartsState,
    sync: SyncState,
    tip: TipState,
};
