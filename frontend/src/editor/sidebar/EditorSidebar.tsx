import React, { Dispatch, useState } from 'react';
import { SerializedChart, SerializedTask, UpdateGoalAction } from 'flowcharts-common';
import { connect } from 'react-redux';
import { AppState } from '../../types';
import { TipAction } from '../../reducers/tip';
import { ChartInfo } from './ChartInfo';
import { ChartSettings } from './ChartSettings';

type EditorSidebarProps = {
    chart: SerializedChart,
    width: number,

    onUpdateGoal: (chartId: string, goal: SerializedTask) => void,
};

type SidebarContentType = 'taskInfo' | 'chartSettings' | 'chartInfo' | 'history';

const mapStateToProps = (_: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch<TipAction | UpdateGoalAction>) => ({
    onUpdateGoal: (chartId: string, goal: SerializedTask) => dispatch({ type: 'UPDATE_GOAL', chartId, goal }),
});

const EditorSidebarComponent = (props: EditorSidebarProps) => {
    const [content, updateContent] = useState<SidebarContentType>('chartInfo');

    if (props.chart === undefined) {
        return (<div>loading</div>);
    }

    return (
        <aside style={{
            display: 'flex',
            flexDirection: 'column',
            width: props.width + 'px',
            flexBasis: '400px',
            flexShrink: 0,
            marginTop: '-46px',
            borderTop: '0',
            borderRight: '1px',
            borderStyle: 'solid',
            borderColor: 'rgb(242, 242, 242)',
            padding: '71px 25px 25px',
            height: '100%',
            minHeight: '100vh',
        }}>
            {content === 'chartSettings' ?
                <ChartSettings
                    chart={props.chart}
                    onOpenChartInfo={updateContent.bind(undefined, 'chartInfo')}
                    onUpdateGoal={props.onUpdateGoal.bind(undefined, props.chart.id)}/>
                : undefined}

            {content === 'chartInfo' ?
                <ChartInfo chart={props.chart}
                           onOpenChartSettings={updateContent.bind(undefined, 'chartSettings')}/>
                : undefined}
            {content === 'history' ? 'history ' : undefined}
        </aside>
    );
};

export const EditorSidebar = connect(mapStateToProps, mapDispatchToProps)(EditorSidebarComponent);
