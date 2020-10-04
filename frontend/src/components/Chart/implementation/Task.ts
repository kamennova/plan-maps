import { TaskState } from "flowcharts-common";

export class Task {
    public name: string;
    public id: string;

    public description?: string;
    public userId?: number;
    public deadline?: Date;
    public timeResources?: string;
    public isOptional?: boolean = false;

    public state: TaskState;

    constructor(name: string,
                state: TaskState = 'notStarted',
                id: string,
                isOptional: boolean = false,
                desc?: string,
                deadline?: Date) {
        this.name = name;
        this.state = state;
        this.isOptional = isOptional;
        this.id = id;

        if (desc !== undefined) {
            this.description = desc;
        }

        if (deadline !== undefined) {
            this.deadline = deadline;
        }
    }
}
