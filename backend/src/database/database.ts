import {
    ChartUser,
    SerializedChart, SerializedInnerPlanNode, SerializedPlanNode, SerializedStage, SerializedTask, TaskState,
} from "flowcharts-common";
import {User} from "../auth/user";
import { UserChartMetadata } from 'flowcharts-common';

export interface Database {

    createUser(username: string, passwordHash: string): Promise<User>;

    createGoogleAuthUser(username: string, googleId: string): Promise<User>;

    findUserByUsername(username: string): Promise<User | undefined>;

    findUserById(id: number): Promise<User | undefined>;

    findUserByGoogleId(id: string): Promise<User | undefined>;

    deleteUser(user: User): Promise<void>;

    findChartById(id: string): Promise<SerializedChart | undefined>;

    findTaskById(id: string): Promise<SerializedTask | undefined>;

    getTaskByIdOrThrowError(id: string): Promise<SerializedTask>;

    getChartUsersByChartId(id: string): Promise<ChartUser[]>;

    getChartsByUserId(userId: number): Promise<UserChartMetadata[]>;

    createChart(chart: SerializedChart): Promise<void>;
    deleteChart(chartId: string): Promise<void>;
    addChartUserRecord(chartId: string, user: ChartUser): Promise<void>;
    revokeUserAccess(chartId: string, userId: number): Promise<void>;

    createNode(node: SerializedPlanNode, chartId: string): Promise<void>;

    createStage(stage: SerializedStage, chartId: string): Promise<void>;
    createInnerPlanNode(node: SerializedInnerPlanNode, chartId: string): Promise<void>;

    addNodeConnection(node: SerializedPlanNode, nextNodeId: string, chartId: string): Promise<void>;
    updateNodeNext(chartId: string, prevNext: string | null, newNext: string | null): Promise<void>;

    createTask(task: SerializedTask): Promise<void>;
    updateTask(task: SerializedTask): Promise<void>;
    addUserTaskRecord(taskId: string, userId: number): Promise <void>;
    updateTaskStateByNodeId(chartId: string, nodeId: string, taskState: TaskState): Promise<void>;

    addUploadedBackground(backgroundId: string, uploadedBy: number): Promise<void>;
    setChartBackground(chartId: string, backgroundId: string | undefined): Promise<void>;

    addUploadedProfilePicture(profilePictureId: string, uploadedBy: number): Promise<void>;
    setUserProfilePicture(userId: number, profilePicture: string | undefined): Promise<void>;
}
