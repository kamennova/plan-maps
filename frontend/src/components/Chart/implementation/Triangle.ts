import {toDeg, toRad} from "./angleFuncs";

export abstract class Triangle {
    public static getSideByTwoSidesAndAngle(b: number, c: number, angle: number): number {
        return Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(toRad(angle)));
    }

    // a = sqrt(b^2 + c^2 - 2bc*cos(A))
    public static getAngleBySides(left: number, right: number, opposite: number): number {
        return toDeg(Math.acos((left * left + right * right - opposite * opposite) / (2 * left * right)));
    }
}
