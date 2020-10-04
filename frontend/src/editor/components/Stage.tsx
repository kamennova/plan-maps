import React, { CSSProperties } from 'react';
import { CheckCircle, CircleThin } from '../../components/icons';

type StageProps = {
    name: string,
    completed: boolean,
};

export const Stage = (props: StageProps) => {
    const circleStyle: CSSProperties = {
        verticalAlign: 'middle',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        margin: 'auto 0'
    };

    const circle = props.completed ?
        <CheckCircle size='18px' style={circleStyle}/> :
        <CircleThin size='18px' style={circleStyle}/>;

    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            fontSize: '15px',
            margin: '6px 0',
            paddingLeft: '25px'
        }}>
            {circle} {props.name}
        </div>
    )
};
