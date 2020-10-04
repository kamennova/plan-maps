import { ApiError, ApiRequest, ApiResponse } from 'flowcharts-common';
import { Validator } from '../validation';
import { ApiRequestHandler } from './handler';

export const withFieldsValidation = <T extends ApiRequest, E extends ApiResponse> (
    handler: ApiRequestHandler<T, E>,
    validation: Record<string, Validator<any>>,
): ApiRequestHandler<T, E | ApiError> => {
    return async (req: T): Promise<E | ApiError> => {
        for (const key of Object.keys(validation)) {
            const verdict = await (validation[key]((req.body as any)[key]));
            if (!verdict.isPositive) {
                return {
                    status: 400,
                    message: verdict.details || 'invalid request',
                };
            }
        }

        return handler(req);
    };
};
