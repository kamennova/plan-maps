import React, { Dispatch } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "../../../types";
import { Dropdown } from "../../Dropdown";
import { UserAction } from '../../../reducers/user';
import { LOGOUT } from '../../../types/actions';
import { ASSETS_ENDPOINT } from '../../../api';

type UserMenuComponentProps = {
    username: string,
    thumbnailSrc?: string,

    logout: () => void,
};

const mapStateToProps = (_: AppState) => ({});
const mapDispatchToProps = (dispatch: Dispatch<UserAction>) => ({
    logout: () => dispatch({ type: LOGOUT }),
});

const minMenuWidth = '110px';

const userMenuHead = (username: string, profilePictureSrc: string | undefined) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            minHeight: '45px',
            minWidth: minMenuWidth,
        }}>
            <UserThumbnail thumbnailSrc={profilePictureSrc}/>
            <span className="username" style={{ userSelect: 'none', fontSize: '14px' }}>{username}</span>
        </div>
    );
};

export const UserThumbnail = (props: { thumbnailSrc?: string, size?: number }) => {
    return (
        <span className="user-thumbnail" style={{ borderRadius: '50%', userSelect: 'none', width: props.size || 30, height: props.size || 30 }}>
            <img
                style={{ borderRadius: '50%' }}
                src={props.thumbnailSrc || '/defaultAvatar.jpg'}
                width={props.size || 30}
                height={props.size || 30} />
        </span>
    );
};

const userMenuLink = (name: string, link: string, isLast: boolean = false, onClick?: () => void) => {
    return (
        <div style={{ marginBottom: isLast ? '0' : '12px' }}>
            <Link style={{ color: 'black', fontSize: '14px' }} to={link} onClick={onClick}>{name}</Link>
        </div>
    );
};

const UserMenuComponent = (props: UserMenuComponentProps) => {
    const profilePictureSrc = props.thumbnailSrc !== undefined ?
        (ASSETS_ENDPOINT + 'profile_picture/' + props.thumbnailSrc) : undefined;

    return (
        <Dropdown header={userMenuHead(props.username, profilePictureSrc)}
                  listStyle={{ top: '45px', minWidth: minMenuWidth, padding: '12px 20px 15px 17px' }}
                  options={[
                      userMenuLink('Profile', '/profile'),
                      userMenuLink('Dashboard', '/'),
                      userMenuLink('Log out', '/auth/login', true, props.logout),
                  ]}
        />
    );
};

export const UserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenuComponent);
