import { Database } from '../database';
import { DeleteChartAction } from 'flowcharts-common';

export const deleteChartHandler = (database: Database) => async (action: DeleteChartAction): Promise<void> => {
    await database.deleteChart(action.chartId);
};