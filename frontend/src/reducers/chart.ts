import {
    SerializedChart,
    SerializedPlanNode,
    PlanNodeType,
    Position,
    AddChartNodeAction,
    UpdateChartNodeAction,
    DeleteChartNodeAction,
    UpdateTaskStateForNodeAction,
    DELETE_CHART,
    DeleteChartAction,
    UPDATE_NODE,
    UpdateGoalAction,
    UPDATE_GOAL,
    REVOKE_ACCESS,
    GRANT_ACCESS,
    RevokeAccessAction,
    GrantAccessAction, SetBackgroundAction, SET_BACKGROUND,
} from 'flowcharts-common';
import {
    SET_CHART,
    ADD_NODE,
    SELECT_NODE,
    UNSELECT_NODE,
    UPDATE_TASK_STATE_FOR_NODE,
    LOGOUT,
    DELETE_NODE
} from '../types/actions';

import { addBranch, addStage, addStep, replaceNodeInArray } from "./chart/addNode";
import { deleteNodeById } from "./chart/deleteNode";
import { UserLogoutAction } from './user';

export type SetChartAction = {
    type: 'SET_CHART',
    chart: SerializedChart,
};

export type SelectNodeAction = {
    type: 'SELECT_NODE',
    node: string,
    position?: Position,
};

export type UnselectNodeAction = {
    type: 'UNSELECT_NODE',
};

export type ChartAction = UserLogoutAction
    | DeleteChartAction
    | AddChartNodeAction
    | UpdateChartNodeAction
    | DeleteChartNodeAction
    | SetChartAction
    | SelectNodeAction
    | UnselectNodeAction
    | UpdateTaskStateForNodeAction
    | UpdateGoalAction
    | RevokeAccessAction
    | GrantAccessAction
    | SetBackgroundAction;

export type ChartsState = {
    charts: Record<string, SerializedChart>,
    selectedNode?: string,
    selectedNodePosition?: Position,
};

const defaultState: ChartsState = {
    charts: {},
};

export default (state = defaultState, action: ChartAction): ChartsState => {
    switch (action.type) {
        case LOGOUT:
            return {
                ...state,
                charts: {},
            };
        case SET_CHART:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chart.id]: action.chart,
                }
            };
        case DELETE_CHART:
            const chartsWithoutDeletedChart = { ...state.charts };
            delete chartsWithoutDeletedChart[action.chartId];

            return {
                ...state,
                charts: chartsWithoutDeletedChart,
            };
        case ADD_NODE:
            const addNodeReducer = getAddNodeReducerByType(
                state.charts[action.chartId],
                action.node.type
            );

            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: addNodeReducer(action.node),
                }
            };
        case UPDATE_NODE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        nodes: replaceNodeInArray(action.node, state.charts[action.chartId].nodes),
                    },
                }
            };
        case DELETE_NODE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: deleteNodeById(state.charts[action.chartId], action.node),
                }
            };
        case SELECT_NODE:
            return { ...state, selectedNode: action.node, selectedNodePosition: action.position };
        case UNSELECT_NODE:
            return { ...state, selectedNode: undefined, selectedNodePosition: undefined };
        case UPDATE_TASK_STATE_FOR_NODE:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        nodes: state.charts[action.chartId].nodes
                            .map(node => node.id === action.nodeId ? ({
                                ...node,
                                task: {
                                    ...node.task,
                                    state: action.taskState,
                                }
                            }) : node)
                    }
                }
            };
        case UPDATE_GOAL:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        goal: action.goal,
                    }
                }
            };
        case REVOKE_ACCESS:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        users: state.charts[action.chartId].users.filter(user => user.id !== action.userId),
                    },
                },
            };
        case GRANT_ACCESS:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        users: [
                            ...state.charts[action.chartId].users,
                            {
                                id: action.userId,
                                role: action.role,
                                invitedBy: action.invitedBy,
                            },
                        ],
                    },
                },
            };
        case SET_BACKGROUND:
            return {
                ...state,
                charts: {
                    ...state.charts,
                    [action.chartId]: {
                        ...state.charts[action.chartId],
                        style: {
                            ...state.charts[action.chartId].style,
                            background: action.backgroundId
                        }
                    }
                }
            };
        default:
            return state;
    }
};

const getAddNodeReducerByType = (chart: SerializedChart, type: PlanNodeType): ((node: SerializedPlanNode) => SerializedChart) => {
    switch (type) {
        case 'step':
            return (node: SerializedPlanNode) => addStep(chart, node, []);
        case 'branch':
            return addBranch.bind(undefined, chart);
        case 'stage':
            return addStage.bind(undefined, chart);
    }
};
