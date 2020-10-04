import {
    AddChartNodeAction,
    UpdateTaskStateForNodeAction,
    UpdateGoalAction,
    GrantAccessAction,
    RevokeAccessAction,
    SetBackgroundAction
} from './chart';
import { DeleteChartAction } from './userCharts';
import { SetProfilePictureAction } from './user';

export type SyncableAction = DeleteChartAction 
    | AddChartNodeAction
    | UpdateTaskStateForNodeAction
    | UpdateGoalAction
    | RevokeAccessAction
    | GrantAccessAction
    | SetBackgroundAction
    | SetProfilePictureAction;