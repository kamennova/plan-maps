import Koa from 'koa';

export const defaultRouterMiddleware = async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        const res = await next();

        ctx.response.status = (res.status) || 200;
        delete res.status;
        ctx.response.body = res;
    } catch (e) {
        ctx.response.status = 500;
        ctx.response.body = {
            message: 'internal_server_error',
        };
        throw e;
    }
};
