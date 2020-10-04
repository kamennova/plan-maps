import { UserChartMetadata } from './metadata';

export type GetUserChartsResponse = {
    status: number,
    charts: UserChartMetadata[],
};
