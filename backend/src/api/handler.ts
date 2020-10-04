import Koa from 'koa';
import { ApiRequest, ApiResponse } from 'flowcharts-common';

export type ApiRequestHandler<T extends ApiRequest, E extends ApiResponse> = (req: T) => Promise<E>;

export const apiHandler =
    <T extends ApiRequest, E extends ApiResponse> (handler: ApiRequestHandler<T, E>) =>
    async (ctx: Koa.Context): Promise<E> => handler({ body: ctx.request.body, params: ctx.params } as T);
