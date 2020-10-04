import { PlanNodeType } from "flowcharts-common";
import React, { CSSProperties, ReactNode } from "react";
import { PencilIcon, SandClockIcon, TickIcon } from "../../../components/icons";
import { TrashIcon } from "../../../components/icons";
import { PlusSpanIcon } from "../../../components/spanIcons";

export type ButtonProps = {
    onClick?: () => void,
};

type ButtonWrapperProps = {
    children?: ReactNode,
    onClick?: () => void,
};

export const ButtonWrapper = (props: ButtonWrapperProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minWidth: '40px',
            cursor: 'pointer',
        }} onClick={props.onClick}>
            {props.children}
        </div>
    );
};

export const ButtonDivider = () => (<hr style={{
        width: '0',
        height: '33px',
        margin: 'auto 10px',
        border: 'none',
        borderRight: '1px solid lightgrey',
    }}/>
);

export const MenuButtonLabel = (props: { content: string, style?: CSSProperties }) => {
    return (<div style={{
        marginTop: '4px',
        fontSize: '11px',
        color: 'black',
        userSelect: 'none',
        ...props.style
    }}>
        {props.content}
    </div>);
};

export const CompletedButton = (props: ButtonProps) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <TickIcon size='18' style={{ fill: 'green', margin: '7px 0 1px' }}/>
            <MenuButtonLabel content='Completed'/>
        </ButtonWrapper>
    );
};

export const InProgressButton = (props: ButtonProps) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <SandClockIcon size='16' style={{ margin: '8px 0 2px' }}/>
            <MenuButtonLabel content='In progress'/>
        </ButtonWrapper>
    );
};

export const NotStartedButton = (props: ButtonProps) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <img src={'/lazyCat.png'} style={{ userSelect: 'none' }} width={32} height={28} alt='Not started'/>
            <MenuButtonLabel content='Not started'/>
        </ButtonWrapper>
    );
};

export const AddLowerButton = (props: ButtonProps & { type?: PlanNodeType }) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <PlusSpanIcon fill='#6517ff' sickness='3px' size='16px' style={{ margin: '4px 0' }}/>
            <MenuButtonLabel style={{ whiteSpace: 'nowrap' }}
                             content={props.type && props.type !== 'step' ? 'Add child' : 'Add previous'}/>
        </ButtonWrapper>
    );
};

export const EditButton = (props: ButtonProps) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <PencilIcon style={{ fill: 'black', margin: '4px 0 3px' }} size='16px'/>
            <MenuButtonLabel content='Edit'/>
        </ButtonWrapper>
    );
};

export const DeleteButton = (props: ButtonProps) => {
    return (
        <ButtonWrapper onClick={props.onClick}>
            <TrashIcon style={{ fill: 'darkgrey', margin: '4px 0 2px' }} size='17px'/>
            <MenuButtonLabel content='Delete'/>
        </ButtonWrapper>
    );
};
