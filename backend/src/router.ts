import { Container } from 'inversify';
import Router from 'koa-router';

import { apiHandler, defaultRouterMiddleware } from './api';
import authInit from './auth/auth';

/**
 * This routes requests to controllers.
 * Acts as a medium between Koa and application logic.
 */
export default async (container: Container) => {
    const router = new Router();
    const { signUp, login, googleAuth } = authInit(container);

    router.use(defaultRouterMiddleware);

    router.post('/signup', apiHandler(signUp));
    router.post('/login', apiHandler(login));
    router.post('/google_auth', apiHandler(googleAuth));

    return router;
};
