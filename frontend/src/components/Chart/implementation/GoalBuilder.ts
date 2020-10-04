import { Goal } from "./Goal";

export class GoalBuilder {
    private readonly name: string;
    private description?: string;
    private deadline?: Date;

    constructor(name: string) {
        this.name = name;
    }

    public setDescription(desc: string) {
        this.description = desc;

        return this;
    }

    public setDeadline(deadline: Date) {
        this.deadline = deadline;

        return this;
    }

    public build() {
        return new Goal(this.name, '1', this.description, this.deadline);
    }
}
