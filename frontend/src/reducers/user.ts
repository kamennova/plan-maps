import { SET_PROFILE_PICTURE, SetProfilePictureAction, UserInfo } from 'flowcharts-common';

import { UPDATE_USER_INFO, LOGOUT, UPDATE_KNOWN_USER } from '../types/actions';

export type SetUserInfoAction = {
    type: 'UPDATE_USER_INFO',
    user: UserInfo,
};

export type UserLogoutAction = {
    type: 'LOGOUT',
};

export type UpdateKnownUserAction = {
    type: 'UPDATE_KNOWN_USER',
    user: UserInfo,
};

export type UserAction = SetUserInfoAction | UserLogoutAction | UpdateKnownUserAction | SetProfilePictureAction;

export type UserState = {
    user?: UserInfo,
    knownUsers: UserInfo[],
};

const defaultState: UserState = {
    user: undefined,
    knownUsers: [],
};

export default (state = defaultState, action: UserAction): UserState => {
    switch (action.type) {
        case UPDATE_USER_INFO:
            return {
                ...state,
                user: action.user,
                knownUsers: [
                    ...state.knownUsers.filter(user => user.id !== action.user.id),
                    action.user,
                ]
            };
        case LOGOUT:
            localStorage.authToken = {};
            return {
                ...state,
                user: undefined,
            };
        case UPDATE_KNOWN_USER:
            return {
                ...state,
                knownUsers: [
                    ...state.knownUsers.filter(user => user.id !== action.user.id),
                    action.user,
                ]
            };
        case SET_PROFILE_PICTURE:
            const userWithOldProfilePicture = state.knownUsers.find(user => user.id === action.userId);

            return {
                ...state,
                knownUsers: state.knownUsers.map(user => (user.id === userWithOldProfilePicture?.id) ? ({
                    ...userWithOldProfilePicture,
                    profilePicture: action.profilePicture,
                }) : user),
                user: state.user !== undefined ? ({
                    ...state.user,
                    profilePicture: action.profilePicture
                }) : undefined,
            };
        default:
            return state;
    }
};