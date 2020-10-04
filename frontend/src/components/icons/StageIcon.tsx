import { CircleIcon } from "../spanIcons";
import { BranchIcon } from "./BranchIcon";
import { DEFAULT_SIZE, IconProps } from "./iconProps";
import React, { CSSProperties } from "react";

export const StageIcon = (props: IconProps & { fill: string }) => {
    const iconStyle: CSSProperties = { position: 'absolute', top: '2px' };

    return (
        <span style={{
            display: 'block',
            width: (props.size || DEFAULT_SIZE) + 'px',
            height: (props.size || DEFAULT_SIZE) + 'px',
            borderTop: `1px dashed ${props.fill}`,
            borderBottom: `1px dashed ${props.fill}`,
            ...props.style
        }}>
        <BranchIcon size='10px' style={{ ...iconStyle, fill: props.fill }}/>
        <CircleIcon fill={props.fill} sickness={'1'} size={'4px'} style={{...iconStyle, right: 0}}/>
    </span>
    );
};
