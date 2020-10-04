export class MarkerStyle {
    public r: number;
    public fill: string;
    public stroke: string;
    public strokeWidth: string;
    public dropShadow: boolean;

    constructor(radius: number = 16, fill: string = '#f1f2ff', stroke: string = '#6875ff', strokeWidth: number = 2,
                dropShadow: boolean = false) {
        this.r = radius;
        this.fill = fill;
        this.strokeWidth = strokeWidth.toString();
        this.stroke = stroke;
        this.dropShadow = dropShadow;
    }
}
