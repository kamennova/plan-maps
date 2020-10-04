import React, { Dispatch } from 'react';
import { SerializedChart, SerializedPlanNode, UserInfo } from 'flowcharts-common';
import { TasksList } from '../../components/TaskList/TasksList';
import { ChartHeadline, SidebarDelimiter } from '../components';
import { Collapsible } from '../components/Collapsible';
import { Tip } from './Tip';
import { connect } from 'react-redux';
import { AppState } from '../../types';
import { TipAction } from '../../reducers/tip';
import { DISMISS_TIP } from '../../types/actions';

export type ChartInfoProps = {
    chart: SerializedChart,
    onOpenChartSettings: () => void,
    onOpenTaskInfo?: (node: SerializedPlanNode) => void,
    user?: UserInfo,

    isTipDismissed: boolean,
    dismissTip: () => void,
};

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
    isTipDismissed: state.tip.dismissedTips.includes('EDITOR_SIDEBAR_TIP'),
});

const mapDispatchToProps = (dispatch: Dispatch<TipAction>) => ({
    dismissTip: () => dispatch({ type: DISMISS_TIP, tipType: 'EDITOR_SIDEBAR_TIP' }),
});

const ChartInfoComponent = (props: ChartInfoProps) => {
    return (
        <div>
            <ChartHeadline
                chart={props.chart}
                onOpenChartSettings={props.onOpenChartSettings}/>
            <SidebarDelimiter/>
            <Collapsible title='Tasks'>
                <TasksList chart={props.chart} thisUserId={props.user?.id}/>
            </Collapsible>
            <SidebarDelimiter/>
            {!props.isTipDismissed ? undefined : (
                <Tip onDismiss={props.dismissTip} content={
                    <p>
                        Add new points to your plan by pressing the Add point button. <br/>
                        To open point's menu, click on its marker. You can edit, delete or add a previous point in Edit
                        mode and update task state in Mark mode.
                    </p>
                }/>
            )}
        </div>
    );
};

export const ChartInfo = connect(mapStateToProps, mapDispatchToProps)(ChartInfoComponent);
