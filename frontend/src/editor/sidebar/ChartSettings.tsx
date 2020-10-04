import { connect } from 'react-redux';
import React, { useState, CSSProperties, Dispatch } from 'react';
import {
    SerializedChart,
    SerializedTask,
    UserInfo,
    REVOKE_ACCESS,
    GRANT_ACCESS,
    UserRole,
    dateToYYYYMMDD,
    ChartUser,
    SetBackgroundAction,
    SET_BACKGROUND,
} from 'flowcharts-common';
import { InputWithLabel, Button, Input, Select, SelectOption } from '../../components';
import { AppState } from '../../types';
import { ChartAction } from '../../reducers/chart';
import { SharedWithUserRow } from './SharedWithUserRow';
import { ChartBackgroundControls } from './ChartBackgroundControls';
import { loadUserByUsername } from '../../api';
import { UPDATE_KNOWN_USER } from '../../types/actions';
import { InputErrorAlert } from '../../components/InputErrorAlert';
import { UserAction } from '../../reducers/user';
import { AssertionError } from 'assert';

export type ChartSettingsComponentProperties = {
    chart: SerializedChart,
    onOpenChartInfo: () => void,
    onUpdateGoal: (goal: SerializedTask) => void,

    user?: UserInfo,
    knownUsers: UserInfo[],

    updateKnownUser: (user: UserInfo) => void,
    onRevokeAccess: (chartId: string, userId: number) => void,
    onGrantAccess: (chartId: string, userId: number, role: UserRole, invitedBy: number) => void,
    onSelectBackground: (chartId: string, backgroundId: string | undefined) => void,
};

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
    knownUsers: state.user.knownUsers,
});

const mapDispatchToProps = (dispatch: Dispatch<ChartAction | UserAction | SetBackgroundAction>) => ({
    updateKnownUser: (user: UserInfo) => dispatch({ type: UPDATE_KNOWN_USER, user }),
    onRevokeAccess: (chartId: string, userId: number) => dispatch({ type: REVOKE_ACCESS, chartId, userId }),
    onGrantAccess: (chartId: string, userId: number, role: UserRole, invitedBy: number) => dispatch({
        type: GRANT_ACCESS,
        chartId,
        userId,
        role,
        invitedBy,
    }),
    onSelectBackground: (chartId: string, backgroundId: string | undefined) => dispatch({
        type: SET_BACKGROUND,
        chartId,
        backgroundId
    })
});

const userRoleOptions: SelectOption[] = [
    { value: 'guest', label: 'guest' },
    { value: 'editor', label: 'editor' },
    { value: 'owner', label: 'owner' },
];

const ChartSettingsComponent = (props: ChartSettingsComponentProperties) => {
    const [ goalName, updateGoalName ] = useState(props.chart.goal.name);
    const [ goalDeadline, updateGoalDeadline ] = useState(
        props.chart.goal.deadline !== undefined ? 
        dateToYYYYMMDD(new Date(props.chart.goal.deadline)) : undefined
    );
    const [ newUserName, updateNewUserName ] = useState('');
    const [ newUserRole, updateNewUserRole ] = useState<UserRole>('guest');
    const [ addUserError, updateAddUserError ] = useState<string | undefined>(undefined);
    const [ background, updateBackground ] = useState<string | undefined>(props.chart.style.background);

    const buttonStyle: CSSProperties = {
        width: 'calc(50% - 5px)',
        marginTop: '10px',
    };

    const thisUserRole = props.chart.users.find(chartUser => chartUser.id === props.user?.id)?.role;

    const getUser = (username: string, callback: (user: UserInfo | undefined) => void) => {
        const userFromKnownUsers = props.knownUsers.find(user => user.username === username);
        if (userFromKnownUsers !== undefined) {
            callback(userFromKnownUsers);
            return;
        }

        loadUserByUsername(username, user => {
            props.updateKnownUser(user);
            callback(user);
        }, callback.bind(undefined, undefined), console.error);
    }

    const knownUsersRows = props.chart.users
        .map(user => ({ user: props.knownUsers.find(knownUser => knownUser.id === user.id), role: user.role }))
        .map(({ user, role }) => user === undefined ? (
            <div>Loading user info...</div>
        ) : (
            <SharedWithUserRow 
                user={user} 
                role={role}
                canRevokeAccess={canRevokeAccess(user.id, props.user?.id, props.chart.users)}
                onRevokeAccess={props.onRevokeAccess.bind(undefined, props.chart.id, user.id)} />
        ));

    const addUserCtl = thisUserRole === 'owner' ? (
        <div style={{ marginTop: '10px' }}>
            { addUserError !== undefined ? <InputErrorAlert>{addUserError}</InputErrorAlert> : undefined }

            <Input 
                value={newUserName} 
                onChange={updateNewUserName} 
                placeholder='Username' 
                style={{ width: 'calc(50% - 5px)' }} />
            <Select 
                value={newUserRole}
                options={userRoleOptions}
                onChange={role => updateNewUserRole(role as UserRole)}
                style={{ width: 'calc(50% - 80px)', marginLeft: '10px' }} />
                    
            <Button onClick={() => {
                const thisUserId = props.user?.id;
                if (thisUserId === undefined) {
                    throw new AssertionError({ message: 'User id is not set even though user role is set' });
                }

                getUser(newUserName, user => {
                    if (user === undefined) {
                        updateAddUserError('User with this username not found');
                        return;
                    }
                    props.onGrantAccess(props.chart.id, user.id, newUserRole, thisUserId);
                    updateNewUserName('');
                });
            }} style={{ minWidth: '60px', marginLeft: '10px' }}>Add</Button>
        </div>
    ) : undefined;

    return (
        <div>
            <InputWithLabel
                label='Goal:'
                value={goalName} 
                onChange={updateGoalName} 
                inputStyle={{ width: '100%' }}
                labelStyle={{display: 'block'}} />

            <InputWithLabel
                label='Deadline:'
                type='date'
                value={goalDeadline} 
                onChange={updateGoalDeadline} 
                inputStyle={{ width: '100%' }}
                labelStyle={{display: 'block'}} />

            <div style={{marginTop: '10px'}}>
                Collaborators:
                { knownUsersRows }

                { addUserCtl }
            </div>

            <ChartBackgroundControls background={background} onNewBackgroundSelected={updateBackground} />

            <div style={{ marginTop: '10px' }}>
                <Button style={buttonStyle} onClick={props.onOpenChartInfo}>Cancel</Button>
                <Button 
                    style={{...buttonStyle, marginLeft: '10px'}}
                    onClick={() => {
                        props.onSelectBackground(props.chart.id, background);
                        props.onUpdateGoal({
                            ...props.chart.goal, 
                            name: goalName, 
                            deadline: goalDeadline !== undefined ? Date.parse(goalDeadline) : undefined,
                        });
                        props.onOpenChartInfo();
                    }}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

const canRevokeAccess = (ofUser: number, byUser: number | undefined, allUsers: ChartUser[]): boolean => {
    if (byUser === undefined) {
        return false;
    }

    const inviteChain = inviteChainOfUser(allUsers, ofUser);

    return inviteChain.indexOf(ofUser) >= inviteChain.indexOf(byUser) && inviteChain.indexOf(byUser) !== -1;
}

const inviteChainOfUser = (allUsers: ChartUser[], userId: number): number[] => {
    const invitedBy = allUsers.find(user => user.id === userId)?.invitedBy;

    if (invitedBy === undefined) {
        return [];
    }

    if (invitedBy === userId) {
        return [ invitedBy ];
    }

    return [ ...inviteChainOfUser(allUsers, invitedBy), userId ];
}

export const ChartSettings = connect(mapStateToProps, mapDispatchToProps)(ChartSettingsComponent);