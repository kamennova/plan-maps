import { Container } from 'inversify';
import Koa from 'koa';
import types from '../types';

const isOriginInWhitelist = (originWhitelist: string[]) => (ctx: Koa.Context) => {
    const requestOrigin = ctx.get('Origin');

    if (originWhitelist.includes(requestOrigin)) {
      return requestOrigin;
    }

    return originWhitelist[0];
};

export default (container: Container) => ({
    isOriginsInWhitelist: isOriginInWhitelist(container.get<string[]>(types.AllowedOrigins)),
});
