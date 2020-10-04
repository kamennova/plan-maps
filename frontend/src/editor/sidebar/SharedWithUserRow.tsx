import React from 'react';
import { UserInfo, UserRole } from 'flowcharts-common';
import { TimesIcon } from '../../components/icons';

export type SharedWithUserRowProps = {
    user: UserInfo,
    role: UserRole,
    canRevokeAccess: boolean,

    onRevokeAccess: () => void,
};

export const SharedWithUserRow = (props: SharedWithUserRowProps) => {     
    return (
        <div style={{ display: 'flex', width: '100%', padding: '10px 0' }}>
            <div style={{ width: 'calc(100% - 120px)' }}>{ props.user.username }</div>
            <div style={{ width: '80px' }}>{ props.role }</div>
            { 
                props.canRevokeAccess ? (
                    <TimesIcon size='18px' style={{ width: '40px', cursor: 'pointer' }} onClick={props.onRevokeAccess} />
                ) : undefined
            }
        </div>
    );
};