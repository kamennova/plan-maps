import uuid from 'uuid';
import { Container } from 'inversify';
import { Database } from '../database';
import { StorageHandler } from '../storage';
import types from '../types';
import { UploadProfilePictureRequest } from './types';
import { UploadProfilePictureResponse } from 'flowcharts-common';

export default (container: Container) => {
    const database = container.get<Database>(types.Database);
    const storage = container.get<StorageHandler>(types.Storage);

    const uploadProfilePictureHandler = async (req: UploadProfilePictureRequest): Promise<UploadProfilePictureResponse> => {
        if (req.rawBody === undefined) {
            return { status: 400 };
        }    
        
        const pictureId = uuid.v4();
        await storage.upload(`profile_picture/${pictureId}`, req.rawBody);
        
        await database.addUploadedProfilePicture(pictureId, req.user.id);

        return {
            status: 200,
            pictureId
        }
    };

    return { uploadProfilePictureHandler };
};