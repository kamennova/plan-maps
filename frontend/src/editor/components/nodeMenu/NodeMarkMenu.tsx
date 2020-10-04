import { TaskState, Position } from "flowcharts-common";
import React, { CSSProperties } from 'react';
import { arrangeButtons } from "./arrangeButtons";
import { NodeMenu } from "./NodeMenu";
import { CompletedButton, InProgressButton, NotStartedButton } from "./NodeMenuComponents";

type NodeMarkMenuProps = {
    taskState: TaskState,
    hideMenu?: ()=>void,
    style?: CSSProperties,
    position?: Position,
    onNewTaskStateSelected?: (taskState: TaskState) => void,
}

export const NodeMarkMenu = (props: NodeMarkMenuProps) => {
    const buttonsToState = {
        'notStarted': <NotStartedButton onClick={props.onNewTaskStateSelected?.bind(undefined, 'notStarted')}/>,
        'inProgress': <InProgressButton onClick={props.onNewTaskStateSelected?.bind(undefined, 'inProgress')}/>,
        'completed': <CompletedButton onClick={props.onNewTaskStateSelected?.bind(undefined, 'completed')}/>
    };

    const buttons = Object.entries(buttonsToState)
        .filter(entry => entry[0] !== props.taskState)
        .map(entry => entry[1]);

    return (
        <NodeMenu hideMenu={props.hideMenu} width={156} pos={props.position} style={props.style}>
            {arrangeButtons(buttons)}
        </NodeMenu>
    );
};
