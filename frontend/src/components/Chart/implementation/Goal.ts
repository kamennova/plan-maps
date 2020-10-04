import { Task } from "./Task";

export class Goal extends Task {
    constructor(name: string, id: string, desc?: string, deadline?: Date) {
        super(name, 'notStarted', id, false, desc, deadline);
    }
}
