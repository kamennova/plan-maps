import React, { useEffect, Dispatch } from 'react';
import { connect } from 'react-redux';

import {
    GetUserChartsResponse,
    UserChartMetadata,
    ApiError,
    SerializedChart,
    UserInfo,
} from 'flowcharts-common';
import { ModalAction } from "../reducers/modal";
import { AppState } from '../types';
import { ChartCard, NewChartCard } from '../components';

import { history } from '../store';
import { api_request, loadChart } from '../api';
import { UserChartsAction } from '../reducers/userCharts';
import { ChartAction } from '../reducers/chart';
import { SET_USER_CHARTS, SET_CHART, UPDATE_KNOWN_USER, SHOW_MODAL } from '../types/actions';
import { UserAction } from '../reducers/user';

type HomeProps = {
    charts: Record<string, SerializedChart>,
    userCharts: UserChartMetadata[],

    onChartLoaded: (chart: SerializedChart) => void,
    onUserLoaded: (user: UserInfo) => void,
    onChartsLoaded: (charts: UserChartMetadata[]) => void,
    onShowCreateChartModal: () => void,
};

const mapStateToProps = (state: AppState) => ({
    charts: state.chart.charts,
    userCharts: state.userCharts.charts,
});
const mapDispatchToProps = (dispatch: Dispatch<UserChartsAction | ChartAction | UserAction | ModalAction>) => ({
    onChartLoaded: (chart: SerializedChart) => dispatch({ type: SET_CHART, chart }),
    onUserLoaded: (user: UserInfo) => dispatch({ type: UPDATE_KNOWN_USER, user }),
    onChartsLoaded: (charts: UserChartMetadata[]) => dispatch({ type: SET_USER_CHARTS, charts }),
    onShowCreateChartModal: () => dispatch({ type: SHOW_MODAL, modal: 'create_chart' }),
});

const HomeComponent = (props: HomeProps) => {
    useEffect(() => {
        loadUserCharts(
            charts => {
                charts
                    .filter(chart => props.charts[chart.chart_id] === undefined)
                    .forEach(chart => loadChart(
                        chart.chart_id,
                        props.onChartLoaded,
                        props.onUserLoaded,
                        console.error.bind(undefined, 'failed to load user chart')
                    ));

                props.onChartsLoaded(charts);
            },
            console.error.bind(undefined, 'failed to load user charts')
        );
    }, []);

    const chartToComponent = (chartId: string) => {
        const chart = props.charts[chartId];

        if (chart !== undefined) {
            const steps = chart.nodes.filter(node => node.type === 'step');

            return (
                <ChartCard
                    name={chart.goal.name}
                    tasksCompleted={steps.filter(step => step.task.state === 'completed').length}
                    tasksNum={steps.length}
                    deadline={chart.goal.deadline}
                    onClick={() => history.push(`/chart/${chartId}`)}/>
            );
        } else {
            return (
                <ChartCard
                    name={'Loading...'}
                    tasksCompleted={0}
                    tasksNum={0}
                    onClick={() => history.push(`/chart/${chartId}`)}/>
            );
        }
    };

    return (
        <div style={{
            padding: '0 20%'
        }}>
            <h1 style={{
                fontSize: '20px',
                marginTop: '20px',
                marginBottom: '20px',
            }}>My plans</h1>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {props.userCharts.map(chart => chartToComponent(chart.chart_id))}
               <NewChartCard onShowCreateChartModal={props.onShowCreateChartModal}/>
            </div>
        </div>
    );
};

const loadUserCharts = (
    onChartsLoaded: (charts: UserChartMetadata[]) => void,
    onError: (res: GetUserChartsResponse | ApiError) => void
) => {
    api_request<GetUserChartsResponse>('chart').then(res => {
        if (res.status === 200) {
            onChartsLoaded((res as GetUserChartsResponse).charts);
        } else {
            onError(res);
        }
    });
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
