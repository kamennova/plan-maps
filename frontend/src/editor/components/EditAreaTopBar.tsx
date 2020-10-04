import React, { CSSProperties, useState } from 'react';
import { Dropdown } from "../../components/Dropdown";
import { BranchIcon } from "../../components/icons";
import { StageIcon } from "../../components/icons";
import { CircleIcon, PlusSpanIcon } from "../../components/spanIcons";
import { Switch } from '../../components/Switch';
import { Button } from '../../components';
import { capitalize, PlanNodeType } from 'flowcharts-common';
import { EditorMode } from "../Editor";

type EditAreaTopBarProps = {
    updateEditorMode: (mode: EditorMode) => void,
    onInitiateNodeCreation: (nodeType: PlanNodeType) => void,
    syncQueueLength: number
};

export const EditAreaTopBar = (props: EditAreaTopBarProps) => {
    const [isEditMode, updateIsEditMode] = useState(true);

    const otherMode = () => isEditMode ? 'mark' : 'edit';

    const addNodeBtn = () => {
        return (
            <Button style={{
                padding: '8px 10px',
                backgroundColor: '#6517ff',
                border: '1px solid #5b18e0',
                fontSize: '15px',
                color: 'white',
                minWidth: '130px'
            }} children={[
                <PlusSpanIcon style={{ marginRight: '6px', right: '7px', top: '1px' }} fill='white' sickness='2px'
                              size='12px'/>,
                'Add point'
            ]}/>
        );
    };

    const addNodeOption = (nodeType: PlanNodeType, isLast: boolean = false) => {
        return (
            <div style={{
                position: 'relative',
                marginBottom: isLast ? '0' : '14px',
                paddingLeft: '25px',
                verticalAlign: 'middle',
                fontSize: '15px',
                color: 'black',
                cursor: 'pointer'
            }} onClick={props.onInitiateNodeCreation.bind({}, nodeType)}>
                {getNodeIconByType(nodeType)} {capitalize(nodeType)}
            </div>
        );
    };

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
        }}>
            <Switch label='Mark' labelOnTheRight='Edit' isChecked={isEditMode} onSwitch={() => {
                updateIsEditMode(!isEditMode);
                props.updateEditorMode(otherMode())
            }}/>
            {props.syncQueueLength > 3 ? (
                <div style={{
                    marginLeft: '30px',
                    marginTop: '-4px',
                    verticalAlign: 'middle',
                    color: '#57606f',
                    userSelect: 'none'
                }}>
                    Changes saved offline: {props.syncQueueLength}
                </div>
            ) : undefined}
            <div style={{
                display: 'flex',
                marginLeft: 'auto',
                opacity: isEditMode ? '1' : '0',
                transition: 'opacity 0.2s ease-out',
            }}>

                <Dropdown header={addNodeBtn()} style={{ marginRight: '10px' }}
                          listStyle={{
                              top: '34px',
                              width: '100%',
                          }}
                          options={[
                              addNodeOption('step'),
                              addNodeOption('branch'),
                              addNodeOption('stage', true)
                          ]}
                />

            </div>
        </div>
    )
};

const getNodeIconByType = (type: PlanNodeType) => {
    const iconStyle: CSSProperties = { position: 'absolute', left: 0, top: '0px', bottom: 0, margin: 'auto 0' };

    switch (type) {
        case 'step':
            return <CircleIcon sickness='2' fill={'white'} size='7px'
                               style={{ borderColor: 'rgb(101, 23, 255)', ...iconStyle, left: '3px' }}/>;
        case 'branch':
            return <BranchIcon size='13' style={{ fill: 'rgb(101, 23, 255)', ...iconStyle, left: '2px' }}/>;
        case 'stage':
            return <StageIcon size='16' fill='rgb(101, 23, 255)' style={{ ...iconStyle }}/>;
    }
};
