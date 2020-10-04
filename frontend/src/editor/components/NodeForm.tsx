import { AssertionError } from "assert";
import {
    capitalize,
    generateRandomColor,
    SerializedChart,
    SerializedInnerPlanNode,
    SerializedPlanNode
} from "flowcharts-common";
import React, { CSSProperties, useEffect, useState } from 'react';
import Multiselect, { ValueType } from 'react-select';
import { Button, Input, Select } from '../../components';
import { CloseButton } from "../../components/CloseButton";
import { InputErrorAlert } from "../../components/InputErrorAlert";
import {
    findNodeById,
    getChartStages,
    getContainerSteps,
    getNodeStage,
    getStageBranches
} from "../../reducers/chart/nodeSearch";

type NewNodePanelProps = {
    chart: SerializedChart,
    style: CSSProperties,
    formMode: string,
    node: SerializedPlanNode,
    onFilled: (node: SerializedPlanNode) => void,
    onDismiss: () => void,
};

const getStageId = (container: SerializedPlanNode | null, nodes: SerializedPlanNode[]): string | null => {
    if (container !== null) {
        if (container.type === 'branch') {
            return getNodeStage(container as SerializedInnerPlanNode, nodes).id;
        }

        return container.id;
    }

    return null;
};

const getBranchId = (container: SerializedPlanNode | null): string => {
    return (container && container.type === 'branch') ? container.id : 'head';
};

export const NodeForm = (props: NewNodePanelProps) => {
    const stages = getChartStages(props.chart);
    const headStageId = stages[0].id;
    const nextStage = props.node.next.length > 0 ? props.node.next[0] : 'head';

    const containerNode = props.node.containerId !== null ? findNodeById(props.node.containerId, props.chart.nodes) : null;
    if (containerNode === undefined) {
        throw new AssertionError({ message: 'container not found' });
    }

    const [nodeName, updateNodeName] = useState(props.node.task.name);

    const [nextStageSelected, updateNextStageSelected] = useState(nextStage);
    const [nodeNext, updateNodeNext] = useState<string[]>(props.node.next);

    const [container, updateContainerSelected] = useState(props.node.containerId || headStageId);
    const [containerBranch, updateContainerBranch] = useState(getBranchId(containerNode));
    const [containerStage, updateContainerStage] = useState(getStageId(containerNode, props.chart.nodes) || headStageId);

    const [submitAttempts, updateSubmitAttempts] = useState(0);

    useEffect(() => {
        updateNodeName(props.node.task.name);
    }, [props.node]);

    const inputLabel = (label: string) => {
        return (
            <label style={{
                display: 'block',
                margin: '4px 0 10px',
                fontSize: '16px',
            }}>{label}:</label>
        );
    };

    const validateName = (name: string) => name.length !== 0;

    const stagesAsSelectOptions = (stages.length === 1 && props.chart.isDefaultHeadStage) ?
        [{ value: headStageId, label: 'none' }] :
        stages.map(stage => ({ value: stage.id, label: stage.task.name }));

    const containerStageSelect = ([
        inputLabel('Stage'),
        <Select value={containerStage}
                options={stagesAsSelectOptions}
                onChange={v => updateContainerByStage(v.toString())}
                style={{ width: '100%', marginBottom: '12px' }}
        />
    ]);

    const branchSelectOptions = getStageBranches(containerStage, props.chart.nodes)
        .map(branch => ({ value: branch.id, label: branch.task.name }));

    const containerBranchSelect = ([
        inputLabel('Branch'),
        <Select value={containerBranch}
                onChange={v => updateContainerByBranch(v.toString())}
                options={[
                    ...branchSelectOptions,
                    { value: 'head', label: 'none' }
                ]}
                style={{ width: '100%', marginBottom: '12px' }}/>
    ]);

    const updateContainerByStage = (v: string) => {
        updateContainerStage(v);
        updateContainerSelected(v);
    };

    const updateContainerByBranch = (v: string) => {
        updateContainerBranch(v);

        if (v === 'head') {
            updateContainerSelected(containerStage.toString())
        } else {
            updateContainerSelected(v.toString());
        }
    };

    const containerSelect = [containerStageSelect, containerBranchSelect];

    const nextStageSelect = (<Select
            value={nextStageSelected}
            options={[
                ...stagesAsSelectOptions,
            ]}
            onChange={v => updateNextStageSelected(v as 'head' | string)}
            style={{
                width: '100%',
            }}/>
    );

    const nextStageField = [inputLabel('Next stage'), nextStageSelect];

    const getValueLabel = (val: string) => nextOptions.find(opt => opt.value === val)?.label || 'head';

    const nextOptions = getContainerSteps(container, props.chart.nodes)
        .map(step => ({ value: step.id, label: step.task.name }));
    const nextSelect = (<Multiselect
            isMulti={true}
            closeMenuOnSelect={false}
            value={
                nodeNext.map(nextVal => ({ value: nextVal, label: getValueLabel(nextVal) }))
            }
            options={nextOptions}
            onChange={v => updateNextSelect(v)}
            style={{
                width: '100%',
            }}/>
    );

    const updateNextSelect = (v: ValueType<{ value: string, label: string }>) => {
        if (v !== undefined && v !== null) {
            const newNext = (v as { value: string, label: string }[]).map(val => val.value);
            updateNodeNext(newNext);
        }
    };

    const nextInnerNodeSelect = [inputLabel('Next steps'), nextSelect];

    return (
        <article style={{
            position: 'absolute',
            top: '70px',
            right: '16px',
            padding: '20px 24px',
            backgroundColor: 'white',
            border: '1px solid lightgrey',
            borderRadius: '4px',
            ...props.style,
        }}>
            <CloseButton style={{ right: '7px', top: '7px' }} onClick={props.onDismiss}/>

            {inputLabel(`${capitalize(props.node.type)} name`)}

            <Input style={{ width: '100%', marginBottom: '12px' }} value={nodeName} onChange={updateNodeName}/>
            {!validateName(nodeName) && submitAttempts > 0 ?
                <InputErrorAlert>Node name cannot be blank</InputErrorAlert> : undefined}

            {props.node.type !== 'stage' ? containerSelect : undefined}
            {props.node.type === 'stage' ? nextStageField : nextInnerNodeSelect}
            <Button style={{
                display: 'block',
                padding: '8px 10px',
                backgroundColor: '#6925d6',
                color: 'white',
                marginTop: '20px'
            }}
                    onClick={() => {
                        if (!validateName(nodeName)) {
                            updateSubmitAttempts(submitAttempts => ++submitAttempts);
                            return;
                        }

                        props.onFilled({
                            ...props.node,
                            task: {
                                ...props.node.task,
                                name: nodeName,
                            },
                            next: props.node.type === 'stage' ? [nextStageSelected] : nodeNext,
                            containerId: props.node.type === 'stage' ? null : container,
                            color: props.node.type === 'stage' ? generateRandomColor() : undefined,
                        });
                    }}>{props.formMode === 'add' ? 'Create' : 'Update'}</Button>
        </article>
    );
};
