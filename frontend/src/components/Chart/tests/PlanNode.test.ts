import {ChartStyle} from "../implementation/ChartStyle";
import {GoalBuilder} from "../implementation/GoalBuilder";
import {PlanChartBuilder} from "../implementation/PlanChartBuilder";
import {PlanChartView} from "../implementation/PlanChartView";
import {Position} from "../implementation/Position";
import {Step} from "../implementation/Step";
import {
    rootStepWithSingleChild,
    singleChildWithEvenNumberOfParents,
    singleChildWithOddNumberOfParents,
    stagesFromStructs,
} from "../implementation/structExamples";

import {Task} from "../implementation/Task";
const myGoal = new GoalBuilder('My super goal').build();

const svg = (document.createElement('svg') as any) as SVGSVGElement;
svg.setAttribute('width', '700');
svg.setAttribute('height', '500');

const bgRect = document.createElement('rect');
bgRect.setAttribute('width', '100%');
bgRect.setAttribute('height', '100%');

svg.appendChild(bgRect);

test('isLowestForAnglesAlgo should return true for non-priority parents', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithEvenNumberOfParents}]))
        .setSvg(svg)
        .build();
    const nonPriorityParent = myChart.headStage.head[0];
    const priorityParent = myChart.headStage.head[1];

    expect(nonPriorityParent.isLowestForAnglesAlgo()).toBe(true);
    expect(priorityParent.isLowestForAnglesAlgo()).toBe(false);
});

test('lowerNodesForAnglesAlgo should return child node when single parent', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: rootStepWithSingleChild}]))
        .setSvg(svg)
        .build();
    const parent = myChart.headStage.head[0];
    const child = parent.prev[0];

    const lowerNodes = parent.lowerNodesForAnglesAlgo();

    expect(lowerNodes.length).toBe(1);
    expect(lowerNodes[0]).toBe(child);
});

test('lowerNodesForAnglesAlgo should return filtered array for parent node when odd number of parents', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithOddNumberOfParents}]))
        .setSvg(svg)
        .build();
    const nonPriorityParent = myChart.headStage.head[0];
    const priorityParent = myChart.headStage.head[1];
    const child = priorityParent.prev[0];

    expect(nonPriorityParent.lowerNodesForAnglesAlgo().length).toBe(0);

    const lowerNodes = priorityParent.lowerNodesForAnglesAlgo();
    expect(lowerNodes.length).toBe(1);
    expect(lowerNodes[0]).toBe(child);
});

test('lowerNodesForAnglesAlgo should return filtered array for parent node when even number of parents', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithEvenNumberOfParents}]))
        .setSvg(svg)
        .build();
    const nonPriorityParent = myChart.headStage.head[0];
    const firstPriorityParent = myChart.headStage.head[1];
    const secondPriorityParent = myChart.headStage.head[2];
    const child = firstPriorityParent.prev[0];

    expect(nonPriorityParent.lowerNodesForAnglesAlgo().length).toBe(0);

    const firstParentLowerNodes = firstPriorityParent.lowerNodesForAnglesAlgo();
    expect(firstParentLowerNodes.length).toBe(1);
    expect(firstParentLowerNodes[0]).toBe(child);

    const secondParentLowerNodes = secondPriorityParent.lowerNodesForAnglesAlgo();
    expect(secondParentLowerNodes.length).toBe(1);
    expect(secondParentLowerNodes[0]).toBe(child);
});
