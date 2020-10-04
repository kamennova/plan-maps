import { Database } from '../database';
import { SetProfilePictureAction } from 'flowcharts-common';

export const setProfilePictureHandler = (database: Database) => async (action: SetProfilePictureAction): Promise<void> =>
    await database.setUserProfilePicture(action.userId, action.profilePicture);