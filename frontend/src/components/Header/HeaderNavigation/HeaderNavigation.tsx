import React, { Dispatch } from 'react';
import { AppState } from '../../../types';
import { ModalAction } from '../../../reducers/modal';
import { SHOW_MODAL } from '../../../types/actions';
import { connect } from 'react-redux';
import { UserInfo } from 'flowcharts-common';
import { history } from '../../../store';

type HeaderNavigationComponentProps = {
    user?: UserInfo,

    onShowCreateChartModal: () => void,
};

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
});
const mapDispatchToProps = (dispatch: Dispatch<ModalAction>) => ({
    onShowCreateChartModal: () => dispatch({ type: SHOW_MODAL, modal: 'create_chart' }),
});

const HeaderNavigationComponent = (props: HeaderNavigationComponentProps) => {
    return (
        <nav className="main-nav">
            <ul className="user-links list inline list-no-style">
                <li>
                    <button className="btn add-chart-btn btn-brighter" style={{ marginRight: '25px' }}
                            onClick={ props.user !== undefined ?
                                props.onShowCreateChartModal :
                                () => history.push('/auth/login')
                            }>
                        New plan
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export const HeaderNavigation = connect(mapStateToProps, mapDispatchToProps)(HeaderNavigationComponent);
