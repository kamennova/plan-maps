import {SerializedChart} from '../models';

export type GetChartResponse = {
    status: number,
    chart?: SerializedChart
};
