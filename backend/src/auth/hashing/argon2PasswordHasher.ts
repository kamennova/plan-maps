import { hash, verify } from 'argon2';
import { injectable } from 'inversify';

import { PasswordHasher } from './passwordHasher';

/**
 * Argon2 hash algorithm.
 *
 * @see https://www.npmjs.com/package/argon2 module used
 * @see https://en.wikipedia.org/wiki/Argon2 algorithm info
 */
@injectable()
export class Argon2PasswordHasher implements PasswordHasher {

    public hash(password: string): Promise<string> {
        return hash(password);
    }

    // tslint:disable-next-line:no-shadowed-variable
    public verify(password: string, hash: string): Promise<boolean> {
        return verify(hash, password);
    }
}
