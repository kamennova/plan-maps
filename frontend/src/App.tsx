import React, { useEffect, useCallback, Dispatch } from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from './store';

import { Header } from './components/Header';
import { FadeOut } from './components';

import { Signup } from './auth/signup';
import { Login } from './auth/login';
import { Home } from './home';
import { Editor } from './editor';
import { AppState, ModalType } from './types';
import { ModalAction } from './reducers/modal';
import { DISMISS_MODAL } from './types/actions';
import { Modal } from './components';
import { CreateChartModal } from './components/modals/CreateChartModal';
import { Profile } from './profile';

type AppProps = {
    fadeOut: boolean,
    modal?: ModalType,
    dismissModal: () => void,
};

const mapStateToProps = (state: AppState) => ({
    fadeOut: state.modal.fadeOut,
    modal: state.modal.modal,
});

const mapDispatchToProps = (dispatch: Dispatch<ModalAction>) => ({
    dismissModal: () => dispatch({ type: DISMISS_MODAL }),
});

const AppComponent = (props: AppProps) => {
    const onKeydown = useCallback((e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            props.dismissModal();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeydown, false);
        return () => document.removeEventListener('keydown', onKeydown, false);
    }, []);

    return (
        <ConnectedRouter history={history}>
            <Header/>
            <main style={{ position: 'relative' }}>
                {props.fadeOut ? (<FadeOut/>) : undefined}
                {props.modal !== undefined ? (
                    <Modal onDismiss={props.dismissModal}>{modalComponentByType(props.modal)}</Modal>) : undefined}
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/auth/signup' component={Signup}/>
                    <Route exact path='/auth/login' component={Login}/>
                    <Route exact path='/chart/:chartId' component={Editor}/>
                    <Route exact path='/profile' component={Profile} />
                </Switch>
            </main>
        </ConnectedRouter>
    );
};

const modalComponentByType = (type: ModalType) => {
    switch (type) {
        case 'create_chart':
            return (<CreateChartModal/>);
    }
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
