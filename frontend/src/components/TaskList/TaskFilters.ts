import { TaskState } from "flowcharts-common";

export type TaskFilters = {
    state: TaskState[],
    thisUser?: boolean,
    thisUserId?: number,
}
