import { UserChartMetadata, SerializedChart, DELETE_CHART, DeleteChartAction } from "flowcharts-common";
import { SET_USER_CHARTS, CREATE_CHART, LOGOUT } from "../types/actions";
import { UserLogoutAction } from "./user";

export type CreateChartAction = {
    type: 'CREATE_CHART',
    chart: SerializedChart,
};

export type SetUserChartsAction = {
    type: 'SET_USER_CHARTS',
    charts: UserChartMetadata[],
};

export type UserChartsAction = UserLogoutAction | CreateChartAction | SetUserChartsAction | DeleteChartAction;

export type UserChartsState = {
    charts: UserChartMetadata[],
};

const defaultState: UserChartsState = {
    charts: [],
};

export default (state = defaultState, action: UserChartsAction): UserChartsState => {
    switch (action.type) {
        case LOGOUT:
            return {
                ...state,
                charts: [],
            };
        case CREATE_CHART:
            return {
                ...state,
                charts: [
                    ...state.charts,
                    {
                        name: action.chart.goal.name,
                        chart_id: action.chart.id,
                        state: action.chart.goal.state,
                        deadline: action.chart.goal.deadline,
                        background_image: null,
                    } as UserChartMetadata
                ]
            };
        case DELETE_CHART:
            return {
                ...state,
                charts: state.charts.filter(chart => chart.chart_id !== action.chartId),
            }
        case SET_USER_CHARTS:
            return {
                ...state,
                charts: action.charts as UserChartMetadata[],
            };
        default:
            return state;
    }
};

