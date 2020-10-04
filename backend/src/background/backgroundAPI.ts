import uuid from 'uuid';
import { Container } from 'inversify';
import { Database } from '../database';
import { StorageHandler } from '../storage';
import types from '../types';
import { UploadBackgroundRequest } from './types';
import { UploadBackgroundResponse } from 'flowcharts-common';

export default (container: Container) => {
    const database = container.get<Database>(types.Database);
    const storage = container.get<StorageHandler>(types.Storage);

    const uploadBackgroundHandler = async (req: UploadBackgroundRequest): Promise<UploadBackgroundResponse> => {
        if (req.rawBody === undefined) {
            return { status: 400 };
        }    
        
        const backgroundId = uuid.v4();
        await storage.upload(`background/${backgroundId}`, req.rawBody);
        
        await database.addUploadedBackground(backgroundId, req.user.id);

        return {
            status: 200,
            backgroundId
        }
    };

    return { uploadBackgroundHandler };
};