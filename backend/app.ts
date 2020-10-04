import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-morgan';
import 'reflect-metadata';
import containerInit from './src/inversify.config';
import protectedRouter from './src/protectedRouter';
import router from './src/router';
import originSecurity from './src/security/origin';
import types from './src/types';

export default async () => {
    const container = await containerInit();
    const app = new Koa()
        .use(logger('tiny'))
        .use(bodyParser())
        .use(cors({
            origin: originSecurity(container).isOriginsInWhitelist,
            allowMethods: [ 'GET', 'POST' ],
            maxAge: 3600,
        }))
        .use((await protectedRouter(container)).prefix(container.get<string>(types.ApiPrefix)).routes())
        .use((await router(container)).prefix(container.get<string>(types.ApiPrefix)).routes());

    return { container, app };
};
