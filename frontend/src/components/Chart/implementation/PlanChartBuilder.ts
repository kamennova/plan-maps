import { AssertionError } from "assert";
import { ChartStyle } from "./ChartStyle";
import { Goal } from "./Goal";
import { PlanChart } from "./PlanChart";
import { Stage } from "./Stage";

export class PlanChartBuilder {
    private readonly goal: Goal;
    private isPublic: boolean = false;
    private structure: Stage[] = [];
    private svg?: SVGSVGElement;
    private style: ChartStyle = new ChartStyle();
    private isDefaultHeadStage: boolean = false;

    constructor(goal: Goal) {
        this.goal = goal;
    }

    public makePublic() {
        this.isPublic = true;

        return this;
    }

    public setStructure(struct: Stage[]) {
        this.structure = struct;

        return this;
    }

    public setStyle(style: ChartStyle) {
        this.style = style;

        return this;
    }

    public setSvg(svgElem: SVGSVGElement) {
        this.svg = svgElem;

        return this;
    }

    public setIsDefaultHeadStage(isDefault: boolean) {
        this.isDefaultHeadStage = isDefault;

        return this;
    }

    public build() {
        if (this.svg === undefined) {
            throw new AssertionError({ message: 'svg element is not set' });
        }

        return new PlanChart(this.isPublic, this.goal, this.structure, this.svg, this.style, this.isDefaultHeadStage);
    }
}
