import {Branch} from "../implementation/Branch";
import {ChartStyle} from "../implementation/ChartStyle";
import {GoalBuilder} from "../implementation/GoalBuilder";
import {PlanChartBuilder} from "../implementation/PlanChartBuilder";
import {PlanChartView} from "../implementation/PlanChartView";
import {Position} from "../implementation/Position";
import {
    multipleChildrenWithEvenNumberOfParents,
    rootStepWithSingleChild,
    singleChildWithEvenNumberOfParents,
    singleChildWithOddNumberOfParents,
    stagesFromStructs,
    stepsAndBranch,
    stepsOneLevel,
    stepsTwoLevels,
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

test('Setting node angles, leaves only', () => {
    const stages = stagesFromStructs([{task: new Task('f'), structure: stepsOneLevel}]);
    const myChart = new PlanChartBuilder(myGoal).setStructure(stages).setSvg(svg).build();
    myChart.draw();

    const head = myChart.headStage.head;

    expect(head[0].view.ownAngle).toBe(-20);
    expect(head[1].view.ownAngle).toBe(0);
    expect(head[2].view.ownAngle).toBe(20);
});

test('Setting node angles, 2 levels (steps only)', () => {
    const stages = stagesFromStructs([{task: new Task('f'), structure: stepsTwoLevels}]);
    const myChart = new PlanChartBuilder(myGoal).setStructure(stages).setSvg(svg).build();

    myChart.stages.forEach((s) => PlanChartView.getNodesAngles(s));

    const stage = myChart.headStage;
    const stepWithPrevs = stage.head[0];

    expect(stepWithPrevs.prev[0].view.ownAngle).toBe(-20);
    expect(stepWithPrevs.prev[1].view.ownAngle).toBe(0);
    expect(stepWithPrevs.prev[2].view.ownAngle).toBe(20);

    expect(stepWithPrevs.getViewOrThrowError().ownAngle).toBeCloseTo(-10);
    expect(stage.head[1].getViewOrThrowError().ownAngle).toBeCloseTo(20);
});

test('Setting node angles, 3 levels (steps + branches)', () => {
    const stages = stagesFromStructs([{task: new Task('f'), structure: stepsAndBranch}]);
    const myChart = new PlanChartBuilder(myGoal).setStructure(stages).setSvg(svg).build();

    myChart.stages.forEach((s) => PlanChartView.getNodesAngles(s));

    const stage = myChart.headStage;
    const headStep = stage.head[0];
    const branch = stage.head[1];

    if (!(branch instanceof Branch)) {
        throw new Error('This stage`s head has branch');
    }

    const branchStepWithPrevs = branch.head[0];

    expect(headStep.prev[0].view.ownAngle).toBeCloseTo(-10);
    expect(headStep.prev[1].view.ownAngle).toBeCloseTo(10);
    expect(headStep.getViewOrThrowError().parentAngle).toBeCloseTo(10);

    expect(branchStepWithPrevs.getViewOrThrowError().parentAngle).toBeCloseTo(20);
    expect(branch.head[1].view.parentAngle).toBe(0);
    expect(branchStepWithPrevs.getViewOrThrowError().ownAngle).toBeCloseTo(-10);
    expect(branch.head[1].view.ownAngle).toBeCloseTo(20);
    expect(branch.getViewOrThrowError().parentAngle).toBeCloseTo(26.6, 1);

    expect(headStep.getViewOrThrowError().ownAngle).toBeCloseTo(-23.3);
    expect(branch.getViewOrThrowError().ownAngle).toBeCloseTo(15);
});

test('Setting stage head coordinates (1 level)', () => {
    const style = new ChartStyle();
    style.chartDirectionAngle = 90;

    const stages = stagesFromStructs([{task: new Task('f'), structure: stepsOneLevel}]);
    const myChart = new PlanChartBuilder(myGoal).setStructure(stages).setSvg(svg)
        .setStartPosition(new Position(0, 0)).build();
    myChart.draw();
    const stage = myChart.headStage;

    expect(stage.getHeadWidth()).toBe(140);
    expect(stage.getViewOrThrowError().pos.x).toBe(0);
    expect(stage.head[0].view.pos.x).toBeCloseTo(0);
});

test('Is position farther test', () => {
    const style1 = new ChartStyle();
    style1.chartDirectionAngle = -20;

    const chart = new PlanChartBuilder(myGoal).setStructure([]).setStyle(style1).setSvg(svg)
        .setStartPosition(new Position(0, 0)).build();

    const farther = new Position(20, 40);
    const closer = new Position(30, 50);
    expect(chart.view.isPositionFarther(farther, closer)).toBe(true);

    const style2 = new ChartStyle();
    style2.chartDirectionAngle = 20;

    chart.view = new PlanChartView(svg, chart, style2, new Position(0, 0));
    expect(chart.view.isPositionFarther(farther, closer)).toBe(true);
});

test('getOwnAngleAndCoordinates should calculate coordinates for nodes with multiple parents correctly', () => {
    const style = new ChartStyle();
    style.chartDirectionAngle = -20;

    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: multipleChildrenWithEvenNumberOfParents}]))
        .setSvg(svg)
        .setStyle(style)
        .setStartPosition(new Position(10, 20))
        .build();
    myChart.draw();

    const root = myChart.headStage.head[0];
    const child = root.prev[0];

    PlanChartView.getOwnAngleAndCoordinates(child);
    const childView = child.getViewOrThrowError();
    expect(childView.pos.x).toBeCloseTo(15.21, 0.001);
    expect(childView.pos.y).toBeCloseTo(58.70, 0.001);
    expect(childView.ownAngle).toBeCloseTo(2.5, 0.001);
});

test('getNodeAngleComputationParents should return container if no parents', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([
            {task: new Task('stage1'), structure: rootStepWithSingleChild},
            {task: new Task('stage2'), structure: rootStepWithSingleChild},
        ]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.stages[1];
    const child = myChart.stages[1].head[0];

    const parents = PlanChartView.getNodeAngleComputationParents(child);
    expect(parents.length).toBe(1);
    expect(parents[0]).toBe(root);
});

test('getNodeAngleComputationParents should return first node if the only parent', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: rootStepWithSingleChild}]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.headStage.head[0];
    const child = root.prev[0];

    const parents = PlanChartView.getNodeAngleComputationParents(child);
    expect(parents.length).toBe(1);
    expect(parents[0]).toBe(root);
});

test('getNodeAngleComputationParents should return middle parent when number of parents is odd', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithOddNumberOfParents}]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.headStage.head[0];
    const middleParent = myChart.headStage.head[1];
    const child = root.prev[0];

    const parents = PlanChartView.getNodeAngleComputationParents(child);
    expect(parents.length).toBe(1);
    expect(parents[0]).toBe(middleParent);
});

test('getNodeAngleComputationParents should return two middle parents when number of parents is even', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithEvenNumberOfParents}]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.headStage.head[0];
    const firstMiddleParent = myChart.headStage.head[1];
    const secondMiddleParent = myChart.headStage.head[2];
    const child = root.prev[0];

    const parents = PlanChartView.getNodeAngleComputationParents(child);
    expect(parents.length).toBe(2);
    expect(parents).toContain(firstMiddleParent);
    expect(parents).toContain(secondMiddleParent);
});

test('getNodeAngleComputationParentPosition should average parents positions', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithEvenNumberOfParents}]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.headStage.head[0];
    const child = root.prev[0];

    const position = PlanChartView.getNodeAngleComputationParentPosition(child);
    expect(position.x).toBe(10);
    expect(position.y).toBe(20);
});

test('getNodeAngleComputationParentDistance should return average distance to parent', () => {
    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([{task: new Task('test'), structure: singleChildWithEvenNumberOfParents}]))
        .setSvg(svg)
        .build();
    myChart.draw();
    const root = myChart.headStage.head[0];
    const child = root.prev[0];

    const distance = PlanChartView.getNodeAngleComputationParentDistance(child);
    expect(distance).toBe(40);
});

test('getNodeAngleComputationParentAngle should return average parent angle', () => {
    const style = new ChartStyle();
    style.chartDirectionAngle = -20;

    const myChart = new PlanChartBuilder(myGoal)
        .setStructure(stagesFromStructs([
            {task: new Task('test'), structure: multipleChildrenWithEvenNumberOfParents},
        ]))
        .setSvg(svg)
        .setStyle(style)
        .build();
    myChart.draw();

    const root = myChart.headStage.head[0];
    const child = root.prev[0];

    const angle = PlanChartView.getNodeAngleComputationParentAngle(child);
    expect(angle).toBeCloseTo(2.5, 0.001);
});
