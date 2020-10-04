// There is a good position class in chart implementation, but is not really convenient to be used
// with redux, because class loses all its methods after deserialization from json
export type Position = { x: number, y: number };

export const positionSum = (first: Position, second: Position) => ({
    x: first.x + second.x,
    y: first.y + second.y,
});

export const positionSubtract = (first: Position, second: Position) => ({
    x: first.x - second.x,
    y: first.y - second.y,
});