import { Storage } from '@google-cloud/storage';

import stream from 'stream';

import { StorageHandler } from './types';

const storage = new Storage();

export const gcs = (assetsBucketName: string): StorageHandler => {
    const bucket = storage.bucket(assetsBucketName);

    const upload = async (fileName: string, data: Buffer) => {
        const dataStream = new stream.PassThrough();
        const bucketStream = bucket.file(fileName).createWriteStream();
        dataStream.end(data);
        await dataStream.pipe(bucketStream);
    };

    return { upload };
};