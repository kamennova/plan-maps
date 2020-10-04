import { ModalType } from "../types";
import { SHOW_MODAL, DISMISS_MODAL } from "../types/actions";

export type ModalAction = {
    type: string,
    modal?: ModalType,
};

export type ModalState = {
    fadeOut: boolean,
    modal: ModalType | undefined,
};

const defaultState: ModalState = {
    fadeOut: false,
    modal: undefined,
};

export default (state = defaultState, action: ModalAction): ModalState => {
    switch (action.type) {
        case SHOW_MODAL:
            return {
                ...state,
                fadeOut: true,
                modal: action.modal,
            };
        case DISMISS_MODAL:
            return {
                ...state,
                fadeOut: false,
                modal: undefined,
            };
        default:
            return state;
    }
};