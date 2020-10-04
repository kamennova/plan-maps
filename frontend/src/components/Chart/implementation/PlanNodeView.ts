import { AssertionError } from "assert";
import { ChartStyle } from "./ChartStyle";
import { PlanNode } from "./PlanNode";
import { Position } from "./Position";

export type NodeBorder = {
    angle: number;
    length: number;
};

export class PlanNodeView {
    public style: ChartStyle;

    public pos: Position = new Position(0, 0);

    /**
     * Relative (set at first traversal): angle to vertical from parent node,
     * absolute (set at second traversal): angle to chart direction
     */
    public ownAngle: number = 0;

    /**
     * Angle connecting this node's left lower node, parent node and right lower node.
     * If this node doesn't have lower nodes, parentAngle = 0
     */
    public parentAngle: number = 0;

    /**
     * Line connecting this node and the lowest left node of its subtree
     */
    public border: NodeBorder = {
        angle: 0,
        length: 0,
    };

    public label: SVGTextElement;
    public linesOut: SVGLineElement[] = [];
    public linesIn: SVGLineElement[] = [];
    public g: SVGGElement;

    constructor(node: PlanNode, pos: Position, style: ChartStyle) {
        this.pos = pos;
        this.style = style;

        this.label = this.createLabel(node);
        this.g = PlanNodeView.createGroup();

        this.insertIntoGroup(this.label);
    }

    public static createGroup() {
        const g: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        g.setAttribute('x', '0');
        g.setAttribute('y', '0');

        return g;
    }

    private createLabel(node: PlanNode) {
        const text: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', (this.style.stepMarker.r + this.style.label.margin).toString());
        text.setAttribute('font-size', this.style.label.fontSize.toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', this.style.label.color);
        text.setAttribute('font-family', this.style.label.fontFamily);
        text.innerHTML = node.task.name; // replace??

        return text;
    }

    public insertIntoGroup(elem: Element) {
        this.g.appendChild(elem);
    }

    public getSvg(): SVGSVGElement {
        const svg = this.g.parentNode?.parentNode;

        if (!(svg instanceof SVGSVGElement)) {
            throw new AssertionError({ message: 'Group\'s parent should be svg' });
        }

        return svg;
    }

    public insertIntoConnectorsGroup(elem: Element) {
        const conG = this.getSvg().querySelector('.connectors');

        if (!(conG instanceof Element)) {
            throw new AssertionError({ message: 'Connectors group should be an element' });
        }

        conG.appendChild(elem);
    }
}
