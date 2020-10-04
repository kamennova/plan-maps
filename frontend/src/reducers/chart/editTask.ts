import { SerializedChart, SerializedTask, TaskState } from "flowcharts-common";
import { findNodeById } from "./nodeSearch";
import { AssertionError } from "assert";

export const editNodeTask = (chart: SerializedChart, nodeId: string, task: SerializedTask) => {
    const newChart = { ...chart };
    const node = findNodeById(nodeId, chart.nodes);
    if (node === undefined) {
        throw new AssertionError({ message: `Node with id ${nodeId} not found (;﹏;)` });
    }
    node.task = task;

    return newChart;
};

const editNodeTaskState = (chart: SerializedChart, nodeId: string, taskState: TaskState) => {
    const newChart = { ...chart };

    const node = findNodeById(nodeId, newChart.nodes);
    if (node === undefined) {
        throw new AssertionError({ message: `Node with id ${nodeId} not found (;﹏;)` });
    }
    node.task.state = taskState;

    return newChart;
};

export const markNodeTaskAsCompleted = (chart: SerializedChart, nodeId: string) => {
    return editNodeTaskState(chart, nodeId, 'completed');
};

export const markNodeTaskAsInProgress = (chart: SerializedChart, nodeId: string) => {
    return editNodeTaskState(chart, nodeId, 'inProgress');
};

export const markNodeTaskAsNotStarted = (chart: SerializedChart, nodeId: string) => {
    return editNodeTaskState(chart, nodeId, 'notStarted');
};
