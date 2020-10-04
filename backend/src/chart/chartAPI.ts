import {Container} from 'inversify';
import { 
    GetChartResponse, 
    GetUserChartsResponse,
    CreateChartResponse,
} from 'flowcharts-common';
import {Database} from "../database";
import types from "../types";
import { 
    GetChartRequest, 
    GetUserChartsRequest,
    CreateChartRequest,
} from './types';

export default (container: Container) => {
    const database = container.get<Database>(types.Database);

    const getUserCharts = async (req: GetUserChartsRequest): Promise<GetUserChartsResponse> => ({
        status: 200,
        charts: await database.getChartsByUserId(req.user.id)
    });

    const createChart = async (req: CreateChartRequest): Promise<CreateChartResponse> => {
        await database.createChart(req.body.chart);
        return { status: 200 };
    };

    const getChart = async (req: GetChartRequest): Promise<GetChartResponse> => {        
        const chart = await database.findChartById(req.params.chart_id);

        if (chart === undefined) {
            return { status: 404, chart};
        }

        if (chart.users.filter(chartUser => chartUser.id === req.user.id).length === 0) {
            return { status: 403, chart: undefined };
        }

        return { status: 200, chart };
    };

    return {
        getUserCharts,
        createChart,
        getChart,
    };
};
