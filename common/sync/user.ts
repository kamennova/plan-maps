export type SetProfilePictureAction = {
    type: 'SET_PROFILE_PICTURE',
    userId: number,
    profilePicture: string | undefined,
};