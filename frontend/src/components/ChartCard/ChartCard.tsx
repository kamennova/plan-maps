import React, { CSSProperties, useState } from 'react';
import { ChartDeadline } from "../ChartDeadline";
import { ProgressBar } from "../ProgressBar";

type ChartCardProps = {
    name: string,
    tasksNum: number,
    tasksCompleted: number,
    deadline?: number,
    onClick?: () => void,
};

export const cardBorderColor = 'rgb(226, 226, 226)';
export const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '150px',
    width: '260px',
    margin: '0 17px 17px 0',
    borderRadius: '4px',
    color: 'black',
    cursor: 'pointer',
};

export const ChartCard = (props: ChartCardProps) => {
    const [isHover, updateIsHover] = useState(false);

    return (
        <div style={{
            ...cardStyle,
            padding: isHover ? '14px 11px 11px' : '15px 12px 12px',
            border: isHover ? `2px solid ${cardBorderColor}` : `1px solid ${cardBorderColor}`,
            color: 'black',
        }} onClick={() => {
            if (props.onClick !== undefined) {
                props.onClick();
            }
        }}
             onMouseOver={() => updateIsHover(true)} onMouseLeave={() => updateIsHover(false)}>

            <h2 style={{ fontSize: '13pt', margin: '0 0 10px' }}>{props.name}</h2>
            {props.deadline !== undefined ?
                <ChartDeadline style={{ fontSize: '13px' }} deadline={new Date(props.deadline)}/> : undefined}
            <div style={{ marginTop: 'auto' }}>
                <p style={{
                    fontSize: '12px',
                    color: 'grey',
                    marginBottom: '7px'
                }}>{props.tasksCompleted}/{props.tasksNum} completed </p>
                <ProgressBar completed={props.tasksCompleted} total={props.tasksNum}/>
            </div>
        </div>
    );
};
