import { SerializedInnerPlanNode, SerializedStage, TaskState } from "flowcharts-common";
import { chartExample } from "../../components/Chart/serializedChartExample";
import { addInnerNode, addStage } from "../chart/addNode";
import { deleteNodeById } from "../chart/deleteNode";
import { findNodeById, findNodePrevs, findStageByNext } from "../chart/nodeSearch";

const task = {
    id: '4',
    state: 'notStarted' as TaskState,
    name: 'Step task',
    isOptional: false,
};

const step = (id: string, containerId: string, next: string[]): SerializedInnerPlanNode => {
    return {
        type: 'step',
        id,
        containerId,
        task,
        next,
    }
};

test('add node with prev', () => {
    const insertNode = step('2222', '12', ['13']);
    const newChart = addInnerNode(chartExample, insertNode as SerializedInnerPlanNode, ['14']);

    expect(findNodeById('14', newChart.nodes).next[0]).toBe(insertNode.id);
});

test('add stage in between', () => {
    const prevStageId = findStageByNext('12334', chartExample.nodes).id;

    const insertStage = {
        type: "stage",
        id: '012345',
        next: ['12334'],
        containerId: null,
        task: task
    };

    const newChart = addStage(chartExample, insertStage as SerializedStage);
    expect(findNodeById(prevStageId, newChart.nodes).next[0]).toBe('012345');
});

test('add head stage', () => {
    const oldHeadStageId = findStageByNext(null, chartExample.nodes).id;

    const insertStage = {
        type: "stage",
        id: '012345',
        next: ['12334'],
        containerId: null,
        task: task
    };

    const newChart = addStage(chartExample, insertStage as SerializedStage);
    expect(findNodeById(oldHeadStageId, newChart.nodes).next.length).toBe(0);
});

test('delete in-between step', () => {
    const oldPrev = findNodePrevs('15', chartExample.nodes)[0];
    const oldNext = findNodeById('15', chartExample.nodes).next[0];

    const newChart = deleteNodeById(chartExample, '15');
    expect(findNodeById(oldPrev.id, newChart.nodes).next[0]).toBe(oldNext);
});

test('delete head step', () => {
    const oldPrev = findNodePrevs('13', chartExample.nodes)[0];

    const newChart = deleteNodeById(chartExample, '13');
    expect(findNodeById(oldPrev.id, newChart.nodes).next.length).toBe(0);
});

test('delete container', () => {
    const oldChildren = chartExample.nodes.filter(n => n.containerId === '6').map(n => n.id);

    const newChart = deleteNodeById(chartExample, '6');
    expect(newChart.nodes.find(n => oldChildren.includes(n.id))).toBe(undefined);
});
