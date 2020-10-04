import { ApiResponse } from './apiResponse';

export type ApiError = ApiResponse & {
    message: string,
};
