import React, { useEffect, Dispatch, useState } from 'react';
import { SyncQueueElement } from "../reducers/sync";
import { NodeEditMenu, NodeMarkMenu } from "./components/nodeMenu";
import { EditorSidebar } from './sidebar';
import { EditArea } from './editArea/EditArea';
import { Chart } from '../components';

import { EditAreaTopBar, NodeForm } from './components';
import { loadChart } from '../api';

import {
    SerializedChart,
    Position,
    TaskState,
    SerializedPlanNode,
    PlanNodeType, UPDATE_NODE, UserInfo
} from 'flowcharts-common';
import { connect } from 'react-redux';
import { AppState } from '../types';
import { ChartAction } from '../reducers/chart';
import { ADD_NODE, DELETE_NODE, SET_CHART, UNSELECT_NODE, UPDATE_TASK_STATE_FOR_NODE, UPDATE_KNOWN_USER } from '../types/actions';
import { findNodeById, getChartStages } from '../reducers/chart/nodeSearch';
import uuid from 'uuid';
import { UserAction } from '../reducers/user';

export type EditorMode = 'edit' | 'mark';

type EditorProps = {
    match: {
        params: {
            chartId: string,
        }
    },

    charts: Record<string, SerializedChart>,
    syncQueue: SyncQueueElement[],
    selectedNode?: string,
    selectedNodePosition?: Position,

    onChartLoaded: (chart: SerializedChart) => void,
    onUserLoaded: (user: UserInfo) => void,
    onNodeAdded: (chartId: string, node: SerializedPlanNode) => void,
    onNodeUpdated: (chartId: string, node: SerializedPlanNode) => void,
    onNodeDeleted: (chartId: string, node: SerializedPlanNode) => void,
    updateTaskStateForNode: (chartId: string, nodeId: string, taskState: TaskState) => void,
    unselectNode: () => void,
};

const mapStateToProps = (state: AppState) => ({
    charts: state.chart.charts,
    syncQueue: state.sync.queue,
    selectedNode: state.chart.selectedNode,
    selectedNodePosition: state.chart.selectedNodePosition,
});

const mapDispatchToProps = (dispatch: Dispatch<ChartAction | UserAction>) => ({
    onChartLoaded: (chart: SerializedChart) => dispatch({ type: SET_CHART, chart }),
    onUserLoaded: (user: UserInfo) => dispatch({ type: UPDATE_KNOWN_USER, user }),
    updateTaskStateForNode: (chartId: string, nodeId: string, taskState: TaskState) => dispatch({
        type: UPDATE_TASK_STATE_FOR_NODE,
        chartId,
        nodeId,
        taskState
    }),
    onNodeAdded: (chartId: string, node: SerializedPlanNode) => dispatch({
        type: ADD_NODE,
        chartId,
        node: { ...node, next: node.next.filter(next => next !== 'head') }
    }),
    onNodeUpdated: (chartId: string, node: SerializedPlanNode) => dispatch({ type: UPDATE_NODE, chartId, node }),
    onNodeDeleted: (chartId: string, node: SerializedPlanNode) => dispatch({ type: DELETE_NODE, chartId, node }),
    unselectNode: () => dispatch({ type: UNSELECT_NODE }),
});

const EditorComponent = (props: EditorProps) => {
    const thisPageChart = props.charts[props.match.params.chartId];
    const firstStageId = getChartStages(thisPageChart)[0].id;
    const emptyNodeInForm: SerializedPlanNode = {
        id: uuid(),
        task: {
            id: uuid(),
            name: '',
            state: 'notStarted',
        },
        next: [],
        containerId: firstStageId,
        type: 'step',
    };

    const [editorMode, updateEditorMode] = useState<EditorMode>('edit');
    const [showNodeForm, updateShowNodeForm] = useState(false);
    const [nodeInForm, updateNodeInForm] = useState<SerializedPlanNode>(emptyNodeInForm);
    const [formMode, updateFormMode] = useState('add');

    useEffect(() => {
        loadChart(
            props.match.params.chartId,
            props.onChartLoaded,
            props.onUserLoaded,
            console.error.bind({}, 'failed to load chart')
        );
    }, []);

    const sidebarWidth = 400;

    const chartDisplay = thisPageChart === undefined ? (
        <div>Loading...</div>
    ) : (
        <Chart onChartClickEvent={() => console.log('chart click', props.selectedNode)}
               svgWidth={document.body.offsetWidth - sidebarWidth}
               chart={thisPageChart}/>
    );

    const nodeInThisChart = props.selectedNode !== undefined ?
        findNodeById(props.selectedNode, thisPageChart.nodes) : undefined;

    const nodeMarkMenu = (nodeInThisChart !== undefined && props.selectedNodePosition !== undefined) ? (
        <NodeMarkMenu
            hideMenu={props.unselectNode}
            position={props.selectedNodePosition}
            taskState={nodeInThisChart.task.state}
            onNewTaskStateSelected={props.updateTaskStateForNode.bind(
                undefined, thisPageChart.id, props.selectedNode as string
            )}
        />
    ) : undefined;

    const editNode = () => {
        if (nodeInThisChart === undefined) {
            return;
        }

        updateFormMode('edit');
        updateNodeInForm(nodeInThisChart);
        updateShowNodeForm(true);
    };

    const clearNodeInFormAndUpdateType = (type: PlanNodeType) => {
        updateNodeInForm({
            ...emptyNodeInForm,
            type: type,
        });
    };

    const addLower = () => {
        if (props.selectedNode === undefined || nodeInThisChart === undefined) {
            return;
        }

        updateFormMode('add');
        updateNodeInForm({
            ...emptyNodeInForm,
            next: nodeInThisChart.type === 'step' ? [props.selectedNode] : [],
            type: 'step',
            containerId: nodeInThisChart.type === 'step' ? nodeInThisChart.containerId : nodeInThisChart.id,
        });
        updateShowNodeForm(true);
    };

    const onNodeFormFilled = (node: SerializedPlanNode) => {
        if (formMode === 'add') {
            props.onNodeAdded(props.match.params.chartId, node);
        } else {
            props.onNodeUpdated(props.match.params.chartId, node);
        }

        updateShowNodeForm(false);
    };

    const nodeEditMenu = (nodeInThisChart !== undefined && props.selectedNode !== undefined && nodeInThisChart !== undefined &&
        props.selectedNodePosition !== undefined) ? (
        <NodeEditMenu position={props.selectedNodePosition}
                      nodeType={nodeInThisChart.type}
                      hideMenu={() => props.unselectNode()}
                      onNodeDeleted={() => props.onNodeDeleted(props.match.params.chartId, nodeInThisChart)}
                      onNodeEdit={editNode}
                      onAddLower={addLower}
        />
    ) : undefined;

    return (
        <div style={{ display: 'flex' }}>
            <EditorSidebar width={sidebarWidth} chart={thisPageChart}/>
            <EditArea>
                <EditAreaTopBar
                    onInitiateNodeCreation={(nodeType: PlanNodeType) => {
                        clearNodeInFormAndUpdateType(nodeType);
                        updateFormMode('add');
                        updateShowNodeForm(true);
                    }}
                    syncQueueLength={props.syncQueue.length}
                    updateEditorMode={updateEditorMode}
                />
                {chartDisplay}
                {editorMode === 'edit' ? nodeEditMenu : nodeMarkMenu}
                {showNodeForm ?
                    <NodeForm
                        style={{
                            width: '420px',
                            zIndex: 999,
                        }}
                        formMode={formMode}
                        onDismiss={() => updateShowNodeForm(false)}
                        chart={thisPageChart}
                        node={nodeInForm}
                        onFilled={onNodeFormFilled}/> : undefined}
            </EditArea>
        </div>
    );
};

export const Editor = connect(mapStateToProps, mapDispatchToProps)(EditorComponent);
