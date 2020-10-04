import { User } from '../';

export interface AuthTokenDecoder {

    /**
     * Decode token and return user this token was issued to.
     *
     * @returns User if token is valid or undefined if user is not found.
     *          Promise is rejected if token decoding or database operation
     *          fails.
     */
    decodeToken(token: string): Promise<User | undefined>;
}
