import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../types';
import { UserInfo } from 'flowcharts-common/auth/userInfo';
import { UserThumbnail } from '../components/Header/HeaderNavigation';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';
import { api_request, ASSETS_ENDPOINT, monitorAssetUpload } from '../api';
import { SET_PROFILE_PICTURE, SetProfilePictureAction, UploadProfilePictureResponse } from 'flowcharts-common';

type ProfileProps = {
    user?: UserInfo,

    onProfilePictureSelected: (userId: number, pictureId: string | undefined) => void,
}

const mapStateToProps = (state: AppState) => ({
    user: state.user.user,
});
const mapDispatchToProps = (dispatch: Dispatch<SetProfilePictureAction>) => ({
    onProfilePictureSelected: (userId: number, profilePicture: string | undefined) => dispatch({
        type: SET_PROFILE_PICTURE,
        userId,
        profilePicture,
    }),
});

const ProfileComponent = (props: ProfileProps) => {
    const [ uploading, setUploading ] = useState(false);
    const user = props.user;

    if (user === undefined) {
        return (<div style={{ padding: '0 20%'}}>You are not logged in.</div>);
    }

    const profilePictureSrc = user.profilePicture != undefined ?
        (ASSETS_ENDPOINT + 'profile_picture/' + user.profilePicture) : undefined;

    const uploadProfilePictureHandler = (files: FileList | null) => {
        if (files === null) {
            return;
        }
        setUploading(true);

        const reader = new FileReader();
        reader.onload = e => {
            api_request<UploadProfilePictureResponse>('profile_picture', 'POST', e.target?.result, false)
                .then(res => {
                    if (res.pictureId !== undefined) {
                        // It may take a while for uploaded image to propagate to gcs, so we will check every
                        // second until the image is available. Usually the image is ready immediately.
                        monitorAssetUpload('profile_picture/' + res.pictureId, () => {
                            setUploading(false);
                            if (res.pictureId !== undefined) {
                                props.onProfilePictureSelected(user.id, res.pictureId);
                            }
                        });
                    }
                });
        };
        reader.readAsArrayBuffer(files.item(0) as Blob);
    };

    const profilePictureCtl = (user.profilePicture !== undefined && user.profilePicture !== null) ? (
        <>
            <UserThumbnail size={150} thumbnailSrc={profilePictureSrc}/>
            <FileUpload
                style={{ marginLeft: '10px', height: '35px', verticalAlign: 'middle' }}
                onFilesSelected={uploadProfilePictureHandler}>Change</FileUpload>
            <Button
                style={{ marginLeft: '10px', height: '35px', verticalAlign: 'middle' }}
                onClick={props.onProfilePictureSelected.bind(undefined, user.id, undefined)}>
                Remove
            </Button>
        </>
    ) : (uploading ? (
        <div>Uploading profile picture...</div>
    ) : (
        <FileUpload
        style={{ marginLeft: '10px', height: '35px', verticalAlign: 'middle' }}
        onFilesSelected={uploadProfilePictureHandler}>Upload profile picture</FileUpload>
    ));

    return (
        <div style={{ padding: '0 20%' }}>
            <h1>Hello, { user.username }!</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                { profilePictureCtl }
            </div>
        </div>
    );
};

export const Profile = connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);