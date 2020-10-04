import { SerializedChart } from "flowcharts-common";
import { ChartStyle, PlanChartBuilder} from "./implementation";
import { Goal } from "./implementation/Goal";
import { PlanChart } from "./implementation/PlanChart";
import { deserializeNodes } from "./structureParser";

export const deserializeChart = (props: SerializedChart, svg: SVGSVGElement): PlanChart => {
    const goal = new Goal(props.goal.name, props.goal.id, props.goal.description);
    const style = new ChartStyle();
    style.chartDirectionAngle = 0;
    style.lineLength = 80;
    style.minHeadNodeGap = 80;
    style.minNodesSpanAngle = 35;

    const structure = deserializeNodes(props.nodes);
    const chartBuilder = new PlanChartBuilder(goal)
        .setStructure(structure)
        .setSvg(svg)
        .setStyle(style)
        .setIsDefaultHeadStage(props.isDefaultHeadStage);

    if (props.isPublic) {
        chartBuilder.makePublic();
    }

    return chartBuilder.build();
};
