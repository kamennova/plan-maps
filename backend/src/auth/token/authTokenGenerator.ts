import { Authorizable } from '../';

export interface AuthTokenGenerator {

    /**
     * Issue auth token to a user.
     *
     * This can be safely stored in cookies or other client-side storage,
     * and can be used during following requests to indentify user.
     *
     * Promise is returned, because underlying token generation algorithm
     * may contain non-blocking calls.
     *
     * @param user user to issue token to.
     * @return Promise<string> generated token.
     */
    generateToken(user: Authorizable): Promise<string>;
}
