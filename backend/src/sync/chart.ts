import { Database } from "../database";
import {
    PlanNodeType,
    AddChartNodeAction,
    SerializedStage,
    SerializedInnerPlanNode,
    UpdateTaskStateForNodeAction,
    UpdateGoalAction,
    RevokeAccessAction,
    GrantAccessAction,
    SetBackgroundAction,
} from 'flowcharts-common';

export const getAddNodeHandlerByType = (database: Database, type: PlanNodeType) => {
    switch (type) {
        case 'step':
            return addStepHandler(database);
        case 'branch':
            return addBranchHandler(database);
        case 'stage':
            return addStageHandler(database);
    }
};

export const addStepHandler = (database: Database) => async (action: AddChartNodeAction): Promise<void> => {
    await database.createInnerPlanNode(action.node as SerializedInnerPlanNode, action.chartId);
};

export const addBranchHandler = (database: Database) => async (action: AddChartNodeAction): Promise<void> => {
    await database.createInnerPlanNode(action.node as SerializedInnerPlanNode, action.chartId);
};

export const addStageHandler = (database: Database) => async (action: AddChartNodeAction): Promise<void> => {
    const node = action.node as SerializedStage;
    
    const updateStageNextPromise = (node.next.length === 0) ?
        database.updateNodeNext(action.chartId, null, node.id) :
        database.updateNodeNext(action.chartId, node.next[0], node.id);

    await Promise.all([
        updateStageNextPromise,
        database.createNode(action.node, action.chartId)
    ]);
};

export const updateTaskStateHandler = (database: Database) => async (action: UpdateTaskStateForNodeAction): Promise<void> => {
    await database.updateTaskStateByNodeId(action.chartId, action.nodeId, action.taskState);
};

export const updateGoalHandler = (database: Database) => async (action: UpdateGoalAction): Promise<void> => {
    await database.updateTask(action.goal);
};

export const revokeAccessHandler = (database: Database) => async (action: RevokeAccessAction): Promise<void> => {
    await database.revokeUserAccess(action.chartId, action.userId);
};

export const grantAccessHandler = (database: Database) => async (action: GrantAccessAction): Promise<void> => {
    await database.addChartUserRecord(action.chartId, { 
        id: action.userId, 
        role: action.role, 
        invitedBy: action.invitedBy
    });
};

export const setBackgroundHandler = (database: Database) => async (action: SetBackgroundAction): Promise<void> =>
    await database.setChartBackground(action.chartId, action.backgroundId);