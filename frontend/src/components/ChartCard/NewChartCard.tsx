import React from "react";
import { useState } from "react";
import { PlusSpanIcon } from "../spanIcons";
import { cardBorderColor, cardStyle } from "./ChartCard";

export const NewChartCard = (props: { onShowCreateChartModal: () => void }) => {
    const [isHover, updateIsHover] = useState(false);

    return (
        <div style={{
            ...cardStyle,
            alignItems: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
            color: 'grey',
            backgroundImage: `url("data:image/svg+xml;utf8,<svg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'><rect width=\'100%\' height=\'100%\' style=\'fill: none; stroke: ${isHover ? cardBorderColor : 'darkgrey'}; stroke-width: ${isHover ? '4' : '1'}; stroke-dasharray: 5\'/></svg>")`,
        }}
             onMouseOver={() => updateIsHover(true)} onMouseLeave={() => updateIsHover(false)}
             onClick={props.onShowCreateChartModal}
        >
            <span style={{ marginBottom: '12px' }}>New plan</span>
            <span style={{
                display: 'block',
                padding: '12px 12px 9px',
                marginBottom: '12px',
                backgroundColor: '#ececec',
                borderRadius: '50%',
            }}>
            <PlusSpanIcon fill='white' sickness='4px' size={'23px'}/>
            </span>
        </div>);
};
