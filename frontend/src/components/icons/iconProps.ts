import { CSSProperties } from "react";

export const DEFAULT_SIZE: string = '32px';

export type IconProps = {
    size?: string,
    style?: CSSProperties,
    x?: number,
    y?: number,
    onClick?: () => void,
};