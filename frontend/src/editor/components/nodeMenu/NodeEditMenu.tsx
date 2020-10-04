import { PlanNodeType, Position } from "flowcharts-common";
import React, { CSSProperties } from "react";
import { arrangeButtons } from "./arrangeButtons";
import { NodeMenu } from "./NodeMenu";
import { AddLowerButton, DeleteButton, EditButton, } from "./NodeMenuComponents";

type NodeEditMenuProps = {
    nodeType: PlanNodeType,
    hideMenu?: () => void,
    style?: CSSProperties,
    position?: Position,
    onNodeEdit?: () => void,
    onNodeDeleted?: () => void,
    onAddLower?: () => void,
}

export const NodeEditMenu = (props: NodeEditMenuProps) => {
    return (
        <NodeMenu hideMenu={props.hideMenu} width={!props.nodeType || props.nodeType === 'step' ? 206 : 190} pos={props.position}
                  style={props.style}>
            {arrangeButtons([
                <AddLowerButton onClick={props.onAddLower} type={props.nodeType}/>,
                <EditButton onClick={props.onNodeEdit}/>,
                <DeleteButton onClick={props.onNodeDeleted}/>
            ])}
        </NodeMenu>
    );
};
