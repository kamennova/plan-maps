import React from 'react';
import { SerializedChart} from 'flowcharts-common';
import { ChartDeadline } from "../../components/ChartDeadline";
import { EllipsisV } from '../../components/icons';

type ChartHeadlineProps = {
    chart: SerializedChart,
    onOpenChartSettings: () => void,
};

export const ChartHeadline = (props: ChartHeadlineProps) => {
    return (
        <header>
            <h2 style={{
                fontSize: '18px',
            }}>
                {props.chart.goal.name}
                <EllipsisV 
                    size='18px' 
                    style={{verticalAlign: 'middle', marginLeft: '8px', cursor: 'pointer'}}
                    onClick={props.onOpenChartSettings} />
            </h2>
            { (props.chart.goal.deadline !== undefined) ? (
                <ChartDeadline deadline={new Date(props.chart.goal.deadline)}/>) : undefined }
        </header>
    );
};
