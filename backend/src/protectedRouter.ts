import {Container} from 'inversify';
import Koa from 'koa';
import Router from 'koa-router';
import rawBody from 'raw-body';
import {ApiResponse} from '../../common/api';
import {ApiRequestHandler, defaultRouterMiddleware} from './api';
import {AuthTokenDecoder} from './auth';
import {AuthorizedApiRequest} from './auth/authorizedApiRequest';
import chartAPI from "./chart/chartAPI";
import syncAPI from './sync/syncAPI';
import userAPI from './user/userAPI';
import types from './types';
import backgroundAPI from './background/backgroundAPI';
import profilePictureAPI from './auth/profilePictureAPI';

const authMiddleware = (tokenDecoder: AuthTokenDecoder) => async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
    const authToken = ctx.headers['x-auth-token'];

    if (authToken === undefined) {
        return {
            status: 400,
            message: 'x-auth-token is not set',
        };
    }

    const user = await tokenDecoder.decodeToken(authToken);

    if (user === undefined) {
        return {
            status: 403,
            message: 'auth expired',
        };
    }

    ctx.user = user;
    return await next();
};

export const authorizedApiHandler =
    <T extends AuthorizedApiRequest, E extends ApiResponse>(handler: ApiRequestHandler<T, E>, readRawBody: boolean = false) =>
        async (ctx: Koa.Context): Promise<E> => handler({
            body: ctx.request.body,
            rawBody: readRawBody ? await rawBody(ctx.req) : undefined,
            params: ctx.params,
            user: ctx.user
        } as T);

/**
 * This router should be used for any requests requiring user authentication.
 *
 * If no user session is started (or when session is expired), then any request will
 * result in redirect to /login
 * If there is an active session, ctx.user will be set to instance of user performing
 * the request.
 */
export default async (container: Container) => {
    const router = new Router();
    const tokenDecoder = container.get<AuthTokenDecoder>(types.AuthTokenDecoder);
    const { getUserCharts, createChart, getChart } = chartAPI(container);
    const { getUserInfoByUserId, getUserInfoByUsername } = userAPI(container);
    const { syncHandler } = syncAPI(container);
    const { uploadBackgroundHandler } = backgroundAPI(container);
    const { uploadProfilePictureHandler } = profilePictureAPI(container);

    router.use(defaultRouterMiddleware);
    router.use(authMiddleware(tokenDecoder));

    router.get('/chart', authorizedApiHandler(getUserCharts));
    router.post('/chart', authorizedApiHandler(createChart));
    router.get('/chart/:chart_id', authorizedApiHandler(getChart));

    router.get('/user/:user_id', authorizedApiHandler(getUserInfoByUserId));
    router.get('/user/username/:username', authorizedApiHandler(getUserInfoByUsername));

    router.post('/sync', authorizedApiHandler(syncHandler));

    router.post('/background', authorizedApiHandler(uploadBackgroundHandler, true));
    router.post('/profile_picture', authorizedApiHandler(uploadProfilePictureHandler, true));

    return router;
};
