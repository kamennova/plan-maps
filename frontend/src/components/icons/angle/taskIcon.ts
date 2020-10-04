import { TaskState } from "flowcharts-common";
import { CSSProperties } from "react";
import { LockIcon } from "../Lock";
import { SandClockIcon } from "../SandClock";
import { TickIcon } from "../Tick";

export const taskStateIcon = (taskState: TaskState, style?: CSSProperties) => {
    switch (taskState) {
        case 'completed':
            return TickIcon({ size: '15pt', style: style, x: -9, y: -10 });
        case 'inProgress':
            return SandClockIcon({ size: '15px', style:style, x: -8, y: -6 });
        case 'notStarted':
            return LockIcon({ size: '12px', style: style, x: -6, y: -6 });
    }
};
