import { SerializedChart } from 'flowcharts-common';

import { AuthorizedApiRequest } from '../auth/authorizedApiRequest'

export type GetUserChartsRequest = AuthorizedApiRequest & {
    body: {},
    params: {},
};

export type GetChartRequest = AuthorizedApiRequest & {
    body: {},
    params: {
        chart_id: string,
    },
};

export type WriteChartRequest = AuthorizedApiRequest & {
    body: unknown,
    params: {
        chart_id: string,
    },
};

export type CreateUserChartRequest = AuthorizedApiRequest & {
    body: {
        name: string,
        chart_id: number,
    },
    params: {},
};

export type CreateChartRequest = AuthorizedApiRequest & {
    body: {
        chart: SerializedChart,
    },
    params: {},
};
