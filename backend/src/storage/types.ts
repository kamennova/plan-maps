export type StorageHandler = {
    upload: (fileName: string, data: Buffer) => Promise<void>,
};