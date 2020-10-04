import { AssertionError } from "assert";

import { SerializedChart, SerializedPlanNode } from "flowcharts-common";
import React, { useState } from 'react';
import { getTasksByFilter } from "./getTasksByFilter";
import { TaskFilter } from "./TaskFilter";
import { TaskFilters } from "./TaskFilters";
import { TasksStructure } from "./TasksStructure";

type TasksListProps = {
    chart: SerializedChart,
    thisUserId?: number,
    onOpenTaskInfo?: (node: SerializedPlanNode) => void,
}

export const TasksList = (props: TasksListProps) => {
    const showUserFilters = props.chart.users.length > 1;

    const owner = props.chart.users.find(user => user.role === 'owner');
    if (owner === undefined) {
        throw new AssertionError({ message: 'Chart owner not found' });
    }

    const [filters, updateFilters] = useState<TaskFilters>({
        state: ['inProgress', 'notStarted'],
        thisUser: false,
        thisUserId: props.thisUserId,
    });

    const stages = getTasksByFilter(props.chart, { ...filters });

    return (
        <section>
            <TaskFilter filters={filters} updateFilters={updateFilters} showUserFilter={showUserFilters}/>
            <TasksStructure stages={stages} isStageDefault={props.chart.isDefaultHeadStage}/>
        </section>
    );
};
