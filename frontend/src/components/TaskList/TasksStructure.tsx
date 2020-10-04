import { TaskState } from "flowcharts-common";
import React, { useState } from "react";
import { CSSProperties } from "react";
import { LockIcon, SandClockIcon, TickIcon } from "../icons";
import { IconProps } from "../icons/iconProps";
import { InnerNodeWithStructure, NodeWithStructure, StageWithStructure } from "./getTasksByFilter";

const levelMargin = 25;
const MaxMarginLevel = 4;

type TaskListProps = {
    stages: StageWithStructure[],
    isStageDefault: boolean,
};

type TaskItemNameProps = {
    color: string,
    taskState: TaskState,
    isHover: boolean,
    updateIsHover?: () => void,
    style?: CSSProperties,
    children?: JSX.Element | string,
};

type TaskItemProps = {
    color: string,
    level: number,
    node: NodeWithStructure,
    nameStyle?: CSSProperties,
    style?: CSSProperties,
};

export const TasksStructure = (props: TaskListProps) => { // scrollable?
    return (
        <section>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {props.stages.length === 1 && props.isStageDefault ?
                    props.stages[0].structure.map(node =>
                        <TaskItem nameStyle={{ fontSize: '15px' }} level={0} color={props.stages[0].color}
                                  node={node}/>) :
                    props.stages.map(stage =>
                        <TaskItem nameStyle={{ fontSize: '15px' }} level={0} color={stage.color}
                                  node={stage}/>)}
            </ul>
        </section>
    );
};

const isBranchEmpty = (branch: InnerNodeWithStructure) => {
    if (branch.structure.length === 0) {
        return true;
    }

    for (const node of branch.structure) {
        if (node.type === 'step' || !isBranchEmpty(node)) {
            return false;
        }
    }

    return true;
};

const displayInnerNodes = (structure: InnerNodeWithStructure[], level: number, color: string) => {
    const filteredOutEmpty = structure.filter(node => node.type === 'step' || !isBranchEmpty(node));

    return (
        <ul style={{ paddingLeft: level + 1 > MaxMarginLevel ? 0 : levelMargin }}>
            {filteredOutEmpty.map((innerNode) => <TaskItem color={color} node={innerNode} level={level}/>)}
        </ul>
    );
};

const TaskItem = (props: TaskItemProps) => {
    const [isHover, updateIsHover] = useState(false);
    const color = props.node.color !== undefined ? props.node.color : props.color;

    return (
        <li style={{
            position: 'relative',
            padding: '0',
            color: '#4a4a4a',
            listStyle: 'none',
            ...props.style
        }}>
            <TaskItemName isHover={isHover} updateIsHover={() => updateIsHover(!isHover)} color={color}
                          style={props.nameStyle} taskState={props.node.task.state}>
                {props.node.task.name}
            </TaskItemName>
            {props.node.type !== 'step' ? displayInnerNodes(props.node.structure, props.level + 1, color) : undefined}
        </li>
    );
};

const TaskItemName = (props: TaskItemNameProps) => (
    <p onMouseEnter={props.updateIsHover}
       onMouseLeave={props.updateIsHover}
       style={{
           display: 'block',
           margin: '0',
           padding: '9px 5px 9px 30px',
           fontSize: '14px',
           backgroundColor: props.isHover ? '#ebeeff' : 'transparent',
           borderRadius: '3px',
           cursor: 'pointer',
       }}>
        <NodeTaskMarker taskState={props.taskState} color={props.color}/>
        <span style={props.style}>
            {props.children}
        </span>
    </p>
);

const NodeTaskMarker = (props: { color: string, taskState: TaskState, style?: CSSProperties, size?: string }) => {
    return taskStateIcon(props.taskState, {
        size: '8px',
        style: {
            left: '12px',
            top: '13px',
            fill: props.color,
        }
    });
};

export const taskStateIcon = (taskState: TaskState, props: IconProps) => {
    switch (taskState) {
        case 'completed':
            return <TickIcon size='10px' style={{ position: 'absolute', ...props.style, top: '11px' }}/>;
        case 'inProgress':
            return <SandClockIcon size='9px' style={{ position: 'absolute', ...props.style }}/>;
        case 'notStarted':
            return <LockIcon size='8px' style={{ position: 'absolute', ...props.style }}/>;
    }
};
