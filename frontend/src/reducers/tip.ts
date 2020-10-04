import { DISMISS_TIP } from "../types/actions";

export type TipType = 'EDITOR_SIDEBAR_TIP';

export type DismissTipAction = {
    type: 'DISMISS_TIP',
    tipType: TipType,
};

export type TipAction = DismissTipAction;

export type TipState = {
    dismissedTips: TipType[],
};

const defaultState: TipState = {
    dismissedTips: [],
};

export default (state = defaultState, action: TipAction): TipState => {
    switch (action.type) {
        case DISMISS_TIP:
            return {
                ...state,
                dismissedTips: [ ...state.dismissedTips, action.tipType ],
            }
        default:
            return state;
    }
};