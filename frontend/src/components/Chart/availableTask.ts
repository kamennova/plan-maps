import {deserializeChart} from "./chartDeserializer";
import {Branch} from "./implementation/Branch";
import {InnerPlanNode} from "./implementation/PlanNode";
import {PlanNodeContainer} from "./implementation/PlanNodeContainer";
import { SerializedChart, SerializedTask } from 'flowcharts-common';

export const getAvailableTasks = (chartProps: SerializedChart): SerializedTask[] => {
    const svg = new SVGSVGElement();
    const chart = deserializeChart(chartProps, svg);

    const tasks: SerializedTask[] = [];

    for (const stage of chart.stages) {

        if (stage.task.state !== 'completed') {
            return tasks;
        }
    }

    return tasks;
};

const getContainerAvailableTasks = (container: PlanNodeContainer, tasks: SerializedTask[]) => {
    for (const node of container.head) {
        if (node.task.state === 'completed') {
            continue;
        }

        getNodeAvailableTask(node, tasks);
    }
};

const getNodeAvailableTask = (node: InnerPlanNode, tasks: SerializedTask[]) => {
    if (node.task.state !== 'completed') {
        return;
    }

    if (node instanceof Branch) {
        getContainerAvailableTasks(node, tasks);
    } else {
        node.prev.forEach(prev => getNodeAvailableTask(prev, tasks));
    }
};
