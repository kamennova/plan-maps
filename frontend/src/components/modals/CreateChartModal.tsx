import { AssertionError } from 'assert';
import { generateRandomColor, SerializedChart, UserInfo } from 'flowcharts-common';
import React, { CSSProperties, Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { api_request } from '../../api';
import { ModalAction } from '../../reducers/modal';
import { UserChartsAction } from '../../reducers/userCharts';
import { history } from "../../store";
import { AppState } from '../../types';
import { CREATE_CHART, DISMISS_MODAL, SET_CHART } from '../../types/actions';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';

import { Input, InputWithLabel } from '../Input';
import { InputErrorAlert } from "../InputErrorAlert";

type CreateChartModalProps = {
    user?: UserInfo,

    dismissModal: () => void,
    createChart: (chart: SerializedChart) => void,
};

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
});

const mapDispatchToProps = (dispatch: Dispatch<ModalAction | UserChartsAction>) => ({
    dismissModal: () => dispatch({ type: DISMISS_MODAL }),
    createChart: (chart: SerializedChart) => {
        dispatch({ type: SET_CHART, chart });
        dispatch({ type: CREATE_CHART, chart });
    },
});

const CreateChartModalComponent = (props: CreateChartModalProps) => {
    const [goalName, updateGoalName] = useState('');
    const [isPublic, updateIsPublic] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [submitAttempts, updateSubmitAttempts] = useState(0);

    const validateGoalName = (name: string) => name.length > 0;

    const inputStyle: CSSProperties = {
        width: '100%',
        marginTop: '10px',
    };

    const createChart = () => {
        const userInfo = props.user;

        if (userInfo === undefined) {
            throw new AssertionError({
                message: 'User info is not present, even though this modal should shown to authorized users only.'
            });
        }

        const deadlineTimestamp = deadline ? Date.parse(deadline) : undefined;

        const chart: SerializedChart = {
            id: uuid(),
            isPublic: isPublic,
            isDefaultHeadStage: true,
            goal: {
                id: uuid(),
                name: goalName,
                state: 'notStarted',
                isOptional: false,
                deadline: deadlineTimestamp,
            },
            users: [
                {
                    id: userInfo.id,
                    role: 'owner',
                    invitedBy: userInfo.id,
                }
            ],
            nodes: [
                {
                    task: {
                        id: uuid(),
                        name: 'Default stage',
                        state: 'notStarted',
                        isOptional: false,
                        deadline: deadlineTimestamp,
                    },
                    id: uuid(),
                    containerId: null,
                    type: 'stage',
                    next: [],
                    color: generateRandomColor(),
                }
            ],
            style: {
                chartDirectionAngle: 0,
            }
        };

        callCreateChartAPI(chart);
        props.createChart(chart);

        props.dismissModal();
        history.push(`/chart/${chart.id}`)
    };

    return (
        <div>
            <h3 style={{
                padding: '0',
                margin: '0 0 15px',
                fontSize: '23px',
            }}>Create plan map</h3>
            <Input placeholder='Goal' style={inputStyle} value={goalName} onChange={updateGoalName}/>
            {!validateGoalName(goalName) && submitAttempts > 0 ?
                <InputErrorAlert style={{ marginTop: '10px' }}>Goal name cannot be blank</InputErrorAlert> : undefined}
            <Input placeholder='Description' style={inputStyle}/>

            <InputWithLabel 
                style={{ ...inputStyle, display: 'flex' }}
                labelStyle={{ width: '100px', lineHeight: '20pt', padding: '4px 0' }}
                inputStyle={{ width: 'calc(100% - 100px)' }}
                label='Deadline:'
                type='date'
                value={deadline}
                onChange={setDeadline} />

            <div style={{ ...inputStyle, display: 'flex', verticalAlign: 'middle' }}>
                <label style={{ width: '100px', lineHeight: '25px', padding: '4px 0' }}>Is public:</label>
                <Checkbox style={{ marginTop: '4px' }} value={isPublic} onChange={updateIsPublic}/>
            </div>

            <Button style={inputStyle} onClick={() => {
                if (!validateGoalName(goalName)) {
                    updateSubmitAttempts(submitAttempts => ++submitAttempts);
                    return;
                }

                createChart();
            }}>Create</Button>
        </div>
    );
};

const callCreateChartAPI = (chart: SerializedChart) => {
    api_request(`chart`, 'POST', { chart });
};

export const CreateChartModal = connect(mapStateToProps, mapDispatchToProps)(CreateChartModalComponent);
