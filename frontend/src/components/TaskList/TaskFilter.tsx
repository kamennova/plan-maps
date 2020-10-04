import { TaskState } from "flowcharts-common";
import React from "react";
import { TaskFilters } from "./TaskFilters";

type TagColorScheme = {
    color: string,
    bgColor: string,
    border: string,
}

type TaskFilterProps = {
    filters: TaskFilters,
    updateFilters: (filters: TaskFilters) => void,
    showUserFilter: boolean,
}

type TaskTagProps = {
    name: string,
    isEnabled: boolean,
    colors: TagColorScheme,
    updateIsEnabled: () => void,
};

export const TaskFilter = (props: TaskFilterProps) => {
    const updateStateFilter = (value: TaskState) => {
        // task filter can not be deselected, if it's the last one
        if (!props.filters.state.includes(value) || props.filters.state.length > 1) {
            const newState: TaskState[] =

                props.filters.state.includes(value) ?
                    props.filters.state.filter(state => state !== value) :
                    [...props.filters.state, value];

            props.updateFilters({
                ...props.filters,
                state: newState
            })
        }
    };

    const stateTag = (value: TaskState, label: string) =>
        (<TaskTag name={label} isEnabled={props.filters.state.includes(value)} colors={colorScheme[value]}
                  updateIsEnabled={updateStateFilter.bind(undefined, value)}/>);

    return (
        <section style={{ display: 'flex' }}>
            {[
                stateTag('notStarted', 'not started'),
                stateTag('inProgress', 'in progress'),
                stateTag('completed', 'completed'),
            ]}
            {props.showUserFilter && props.filters.thisUser !== undefined ?

                <TaskTag colors={colorScheme.user} isEnabled={props.filters.thisUser} name={'my'}
                         updateIsEnabled={() => {
                             props.updateFilters({ ...props.filters, thisUser: !props.filters.thisUser })
                         }
                         }/> : undefined}
        </section>
    );
};

const TaskTag = (props: TaskTagProps) => {
    return (
        <span style={{
            display: 'inline-block',
            padding: '5px 7px',
            border: `1px solid ${props.colors.border}`,
            borderRadius: '3px',
            margin: '0 6px 3px 0',
            fontSize: '11px',
            color: props.colors.color,
            letterSpacing: '0.05em',
            backgroundColor: props.colors.bgColor,
            opacity: props.isEnabled ? 1 : 0.5,
            cursor: 'pointer',
            userSelect: 'none'
        }} onClick={props.updateIsEnabled}>
          {props.name}</span>
    );
};

const colorScheme = {
    'notStarted': {
        color: '#ff6363',
        bgColor: '#ffedf1',
        border: '#ffd0d0',
    },
    'inProgress': {
        color: '#6a6aff',
        bgColor: '#e7f9ff',
        border: '#e0e0ff',
    },
    'completed': {
        color: '#00b900',
        bgColor: '#e1ffe1',
        border: '#b6ffb6',
    },
    'user': {
        color: '#d6851f',
        bgColor: '#fff8c6',
        border: '#ffe9c7',
    }
};
