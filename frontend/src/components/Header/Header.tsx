import { UserInfo } from "flowcharts-common";
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from '../../types';
import { HeaderNavigation, UserMenu } from './HeaderNavigation';

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
});
const mapDispatchToProps = (_: {}) => ({});

type HeaderProps = {
    user?: UserInfo,
    children?: ReactNode
}

const HeaderComponent = (props: HeaderProps) => {
    return (
        <header className="main-header" style={{ position: 'relative', backgroundColor: 'white' }}>
            <div className="container">
                <Link to="/" className="site-logo">Plan Maps</Link>
                <HeaderNavigation/>
                {props.user === undefined ?
                    [<Link style={{marginRight: '25px'}} to='/auth/login'>Log in</Link>,
                        <Link to='/auth/signup'>Sign up</Link>]
                    :
                    <UserMenu username={props.user.username} thumbnailSrc={props.user.profilePicture}/>}
            </div>
        </header>
    );
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
