export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y);
    }

    public minus(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y);
    }

    public multiply(k: number): Position {
        return new Position(this.x * k, this.y * k);
    }

    // arguments are Positions in coordinates system with Y axis pointed to top
    public isFartherThan(closer: Position, angle: number) {
        // (x-x1)/(x2-x1) = (y-y1)/(y2-y1); y = (x-x1)(y2-y1)/(x2-x1) + y1; y = ((y2-y1)/(x2-x1))x - (y2-y1)x1
        // k = (y2-y1)/(x2-x1) = tg(A)
        const k = (this.y - closer.y) / (this.x - closer.x);
        const deg = Math.atan(k) * 180 / Math.PI;

        return 180 - deg - angle > 90;
    }

    public toBottomBasedSystem(height: number): Position {
        const y = height - this.y;

        return new Position(this.x, y);
    }
}
