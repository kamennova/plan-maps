import { Stage } from "./Stage";
import { Task } from "./Task";
import { userInnerPlanNode } from "./userInnerPlanNode";

const task = (name: string = 'default name') => {
    return new Task(name, 'notStarted', '1');
};

const step = (id: string, next: string[] = [], name: string = 'task name'): userInnerPlanNode => {
    return {
        id,
        next,
        task: task(name),
        type: 'step',
    };
};

const branch = (id: string,
                struct: userInnerPlanNode[] = [],
                next: string[] = [],
                name: string = 'task name'): userInnerPlanNode => {
    return {
        id,
        next,
        structure: struct,
        task: task(name),
        type: 'branch',
    };
};

export const stepsOneLevel = [
    step('1', [], 'step1'),
    step('2', [], 'step2'),
    step('3', [], 'step3'),
];

export const stepsTwoLevels = [
    step('1', [], '2step1'),
    step('2', ['1'], '22step2'),
    step('3', ['1'], '22step3'),
    step('4', ['1'], '22step4'),
    step('5', [], '2step5'),
];

export const stepsAndBranch = [
    step('7', [], '2step3'),
    step('8', ['7'], '2step4'),
    step('9', ['7'], '2step5'),
    branch('6', stepsTwoLevels, [], 'branch'),
];

const branchStruct = [
    step('6', ['7']),
    step('7', [], 'branch head'),
];

export const stepsAndBranch2 = [
    step('1', ['2', '3'], 'next 2 3'),
    step('2', ['4'], 'next 4'),
    step('3', ['4'], 'next 4'),
    step('4', [], 'head of 1'),
    branch('5', branchStruct, [], 'head branch'),
];

export const rootStepWithSingleChild = [
    step('1', [], 'root'),
    step('2', ['1'], 'child'),
];

export const singleChildWithOddNumberOfParents = [
    step('1', [], 'root1'),
    step('2', [], 'root2'),
    step('3', [], 'root3'),
    step('4', ['1', '2', '3'], 'child'),
];

export const singleChildWithEvenNumberOfParents = [
    step('1', [], 'root1'),
    step('2', [], 'root2'),
    step('3', [], 'root3'),
    step('4', [], 'root4'),
    step('5', ['1', '2', '3', '4'], 'child'),
];

export const multipleChildrenWithEvenNumberOfParents = [
    step('1', [], 'root1'),
    step('2', [], 'root2'),
    step('3', [], 'root3'),
    step('4', [], 'root4'),
    step('5', ['1', '2', '3', '4'], 'child'),
    step('6', ['1', '2', '3', '4'], 'child-1a'),
    step('8', ['2'], 'child-2'),
];

export const stagesArr = [
    { task: task('stage1'), structure: stepsOneLevel },
    { task: task('stage2'), structure: stepsAndBranch },
];

export type stageStruct = { task: Task, structure: userInnerPlanNode[] };

export const stagesFromStructs = (structs: stageStruct[]): Stage[] => {
    return structs.map((struct) => new Stage(struct.task, 'id', 'blue', null));
};
