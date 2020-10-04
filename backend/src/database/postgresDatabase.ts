import { AssertionError } from "assert";
import { plainToClass } from 'class-transformer';

import { Container, injectable } from 'inversify';
import { Client } from 'pg';
import { Database } from '.';
import {
    ChartUser,
    SerializedChart, SerializedInnerPlanNode,
    SerializedPlanNode, SerializedStage,
    SerializedTask,
    TaskState
} from "flowcharts-common";
import { AuthTokenGenerator, PasswordHasher, User } from '../auth';
import types from '../types';
import { connectionRow, nodeRow } from "./rowTypes";
import { UserChartMetadata } from 'flowcharts-common';

/**
 * Database implementation using PostgreSQL.
 */
@injectable()
export class PostgresDatabase implements Database {

    constructor(
        private container: Container,
        private client: Client,
    ) {
    }

    /**
     * Connect to PostgreSQL database.
     *
     * @param container inversify container
     * @param connectionString connection string like 'postgres://user:password@host:port/database'
     */
    public static async connect(container: Container, connectionString: string): Promise<PostgresDatabase> {
        const client = new Client(connectionString);
        await client.connect();
        return new PostgresDatabase(container, client);
    }

    public async createUser(username: string, passwordHash: string): Promise<User> {
        const res = await this.client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
            [username, passwordHash],
        );

        const id = res.rows[0].id;

        const user = new User(
            this.container.get<PasswordHasher>(types.PasswordHasher),
            this.container.get<AuthTokenGenerator>(types.AuthTokenGenerator),
            id,
            username,
            passwordHash,
        );
        user.injectDependencies(this.container);
        return user;
    }

    public async createGoogleAuthUser(username: string, googleId: string): Promise<User> {
        const res = await this.client.query(
            'INSERT INTO users (username, google_id) VALUES ($1, $2) RETURNING id',
            [ username, googleId ],
        );

        const id = res.rows[0].id;

        const user = new User(
            this.container.get<PasswordHasher>(types.PasswordHasher),
            this.container.get<AuthTokenGenerator>(types.AuthTokenGenerator),
            id,
            username,
            undefined,
        );
        user.injectDependencies(this.container);
        return user;
    }

    public async findUserByUsername(username: string): Promise<User | undefined> {
        const res = await this.client.query(
            'SELECT * FROM users WHERE username = $1 LIMIT 1',
            [username],
        );

        if (res.rowCount === 0) {
            return Promise.resolve(undefined);
        }

        const user = plainToClass(User, res.rows)[0];
        user.injectDependencies(this.container);
        return user;
    }

    public async findUserById(id: number): Promise<User | undefined> {
        const res = await this.client.query(
            'SELECT * from users WHERE id = $1 LIMIT 1',
            [id],
        );

        if (res.rowCount === 0) {
            return Promise.resolve(undefined);
        }

        const user = plainToClass(User, res.rows)[0];
        user.injectDependencies(this.container);
        return user;
    }

    public async findUserByGoogleId(googleId: string): Promise<User | undefined> {
        const res = await this.client.query(
            'SELECT * from users WHERE google_id = $1 LIMIT 1',
            [ googleId ],
        );

        if (res.rowCount === undefined) {
            return Promise.resolve(undefined);
        }

        const user = plainToClass(User, res.rows)[0];
        user.injectDependencies(this.container);
        return user;
    }

    public async deleteUser(user: User): Promise<void> {
        await this.client.query(
            'DELETE FROM users WHERE id = $1',
            [user.id],
        );
    }

    // --- Read Chart API ---

    public async findChartById(id: string): Promise<SerializedChart | undefined> {
        const chartRes = await this.client.query(
            "SELECT * FROM chart WHERE id = $1 LIMIT 1",
            [id],
        );

        if (chartRes.rows.length === 0) {
            return Promise.resolve(undefined);
        }

        const chart = chartRes.rows[0];
        const goal = await this.getTaskByIdOrThrowError(chart.goal_id);
        const nodes = await this.getChartStructureByChartId(id);
        const users = await this.getChartUsersByChartId(id);

        return {
            id,
            goal,
            users,
            nodes,
            isPublic: chart.is_public,
            isDefaultHeadStage: chart.is_default_head_stage,
            style: {
                chartDirectionAngle: chart.direction_angle,
                background: chart.background
            },
        };
    }

    public async findTaskById(id: string): Promise<SerializedTask | undefined> {
        const taskRes = await this.client.query(
            "SELECT * FROM task WHERE id = $1",
            [id],
        );

        if (taskRes.rows.length === 0) {
            return Promise.resolve(undefined);
        }

        const task = taskRes.rows[0];

        return {
            id: task.id,
            name: task.task_name,
            state: task.task_state,
            deadline: task.deadline === null ? undefined : task.deadline,
        }
    }

    public async getTaskByIdOrThrowError(id: string): Promise<SerializedTask> {
        const task = await this.findTaskById(id);

        if (task === undefined) {
            throw new AssertionError({ message: 'Task should be found' });
        }

        return task;
    }

    private async getChartStructureByChartId(id: string): Promise<SerializedPlanNode[]> {
        const nodes = await this.client.query(
            "SELECT * FROM node WHERE chart_id = $1",
            [id],
        );

        const connections = await this.client.query(
            "SELECT * FROM node_connection WHERE chart_id = $1",
            [id],
        );

        return await this.nodeObjectsFromRows(nodes.rows, connections.rows);
    }

    public async getChartUsersByChartId(id: string): Promise<ChartUser[]> {
        const users = await this.client.query(
            "SELECT * FROM user_charts WHERE chart_id = $1",
            [id],
        );

        return users.rows.map(user => ({
            id: user.user_id,
            role: user.user_role,
            invitedBy: user.invited_by,
        }));
    }

    // --- Create Chart API ---

    public async createChart(chart: SerializedChart): Promise<void> {
        await Promise.all([
            this.createTask(chart.goal),
            this.createChartQuery(chart),
            Promise.all(chart.nodes.map(node => this.createNode(node, chart.id))),
            Promise.all(chart.users.map(user => this.addChartUserRecord(chart.id, user))),
        ]);
    }

    public async deleteChart(chartId: string): Promise<void> {
        await this.client.query(
            'delete from task where id in (select task_id from node where chart_id = $1)',
            [chartId]
        );

        await Promise.all([
            this.client.query('delete from chart where id = $1', [chartId]),
            this.client.query('delete from node where chart_id = $1', [chartId]),
            this.client.query('delete from user_charts where chart_id = $1', [chartId]),
        ]);
    }

    private async createChartQuery(chart: SerializedChart): Promise<void> {
        await this.client.query(
            'INSERT INTO chart (id, goal_id, head_stage_id, direction_angle, is_public, is_archived, status, is_default_head_stage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [chart.id, chart.goal.id, null, chart.style.chartDirectionAngle, chart.isPublic, false, 'open', chart.isDefaultHeadStage],
        );
    }

    public async addChartUserRecord(chartId: string, user: ChartUser): Promise<void> {
        await this.client.query(
            'INSERT INTO user_charts (user_id, chart_id, user_role, notification_interval, invited_by) VALUES ($1, $2, $3, $4, $5)',
            [user.id, chartId, user.role, 20, user.invitedBy],
        );
    }

    public async revokeUserAccess(chartId: string, userId: number): Promise<void> {
        await this.client.query(
            'delete from user_charts where chart_id = $1 and user_id = $2',
            [chartId, userId]
        );
    }

    public async createStage(stage: SerializedStage, chartId: string): Promise<void> {
        await this.createNode(stage, chartId);
        await this.addNodeConnections(stage, chartId);
    }

    public async createInnerPlanNode(node: SerializedInnerPlanNode, chartId: string): Promise<void> {
        await this.createNode(node, chartId);
        await this.addNodeConnections(node, chartId);
    }

    public async createNode(node: SerializedPlanNode, chartId: string) {
        await Promise.all([
            this.createTask(node.task),
            this.client.query(
                'INSERT INTO node (id, task_id, chart_id, container_id, node_type, color, is_head) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [node.id, node.task.id, chartId, node.containerId, node.type, node.color, false],
            )
        ]);
    }

    private async addNodeConnections(node: SerializedPlanNode, chartId: string) {
        return Promise.all(node.next.map((nextNode) => this.addNodeConnection(node, nextNode, chartId)));
    }

    public async addNodeConnection(node: SerializedPlanNode, nextNodeId: string, chartId: string): Promise<void> {
        await this.client.query(
            'INSERT INTO node_connection (node_id, next_node_id, chart_id) VALUES ($1, $2, $3)',
            [node.id, nextNodeId, chartId],
        );
    }

    public async updateNodeNext(chartId: string, prevNext: string | null, newNext: string | null): Promise<void> {
        await this.client.query(
            'update node_connection set next_node_id = $1 where next_node_id = $2 and chart_id = $3',
            [newNext, prevNext, chartId],
        );
    }

    public async createTask(task: SerializedTask): Promise<void> {
        const deadlineAsDate = task.deadline === undefined ? null : new Date(task.deadline);

        await this.client.query(
            'INSERT INTO task (id, task_name, task_desc, deadline, is_optional) VALUES ($1, $2, $3, $4, $5)',
            [task.id, task.name, task.description, deadlineAsDate, task.isOptional],
        );

        if (task.userIds !== undefined) {
            await Promise.all(task.userIds.map((id) => this.addUserTaskRecord(task.id, id)));
        }
    }

    public async updateTask(task: SerializedTask): Promise<void> {
        const deadlineAsDate = task.deadline === undefined ? null : new Date(task.deadline);
        
        await this.client.query(
            'UPDATE task set task_name = $1, task_desc = $2, deadline = $3, is_optional = $4 where id = $5',
            [task.name, task.description, deadlineAsDate, task.isOptional, task.id]
        );
    }

    public async addUserTaskRecord(taskId: string, userId: number): Promise<void> {
        await this.client.query(
            'INSERT INTO user_tasks (task_id, user_id) VALUES ($1, $2)',
            [taskId, userId]
        );
    }

    public async updateTaskStateByNodeId(chartId: string, nodeId: string, taskState: TaskState): Promise<void> {
        await this.client.query(
            'update task set task_state = $1 where id = (select task_id from node where chart_id = $2 and id = $3)',
            [taskState, chartId, nodeId]
        );
    }

    // --- Get Chart API ---

    private async nodeObjectsFromRows(nodeRows: nodeRow[], connectionRows: connectionRow[]):
        Promise<SerializedPlanNode[]> {
        const nodeTasks: SerializedTask[] = await Promise.all(
            nodeRows.map(node => this.getTaskByIdOrThrowError(node.task_id))
        );

        return nodeRows
            .map((node, i) => {
                const next = connectionRows.filter(row => row.node_id == node.id)
                    .map(row => row.next_node_id);

                return {
                    containerId: node.container_id,
                    task: nodeTasks[i],
                    type: node.node_type,
                    id: node.id,
                    color: node.color === null ? undefined : node.color,
                    next,
                };
            });
    }

    public async getChartsByUserId(userId: number): Promise<UserChartMetadata[]> {
        const userCharts = await this.client.query(
            'SELECT chart_id, background FROM user_charts ' +
            'inner join chart on chart.id = user_charts.chart_id ' +
            'WHERE user_id = $1',
            [userId]
        );

        return userCharts.rows as UserChartMetadata[];
    }

    public async addUploadedBackground(backgroundId: string, uploadedBy: number): Promise<void> {
        await this.client.query(
            'insert into uploaded_backgrounds (background_id, uploaded_by) values ($1, $2)',
            [backgroundId, uploadedBy]
        );
    }

    public async setChartBackground(chartId: string, backgroundId: string | undefined): Promise<void> {
        await this.client.query(
            'update chart set background = $1 where id = $2',
            [backgroundId, chartId]
        );
    }

    public async addUploadedProfilePicture(profilePictureId: string, uploadedBy: number): Promise<void> {
        await this.client.query(
            'insert into uploaded_profile_pictures (picture_id, uploaded_by) values ($1, $2)',
            [profilePictureId, uploadedBy]
        );
    }

    public async setUserProfilePicture(userId: number, profilePicture: string | undefined): Promise<void> {
        await this.client.query(
            'update users set profile_picture = $1 where id = $2',
            [profilePicture, userId]
        );
    }
}
