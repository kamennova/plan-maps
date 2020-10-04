import {LabelStyle} from "./LabelStyle";
import {MarkerStyle} from "./MarkerStyle";

export class ChartStyle {
    public chartDirectionAngle: number = 90;

    public minNodesSpanAngle = 20;
    public minRad: number = 30;
    /**
     * Minimal distance between head nodes in px
     */
    public minHeadNodeGap: number = 70;

    public stepMarker: MarkerStyle = new MarkerStyle();
    public branchMarker: MarkerStyle = new MarkerStyle(4, 'blue');

    /**
     * Displays node's task name
     */
    public label: LabelStyle = new LabelStyle();

    public lineStroke: string = '#d0d0d0';
    public lineLength: number = 40;

    /**
     * Distance between Stages views in px
     */
    public stageGap: number = 80;
}
