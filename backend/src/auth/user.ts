import { Container } from 'inversify';

import { Expose } from 'class-transformer';
import types from '../types';
import { Authorizable } from './authorizable';
import { PasswordHasher } from './hashing/passwordHasher';
import { AuthTokenGenerator } from './token/authTokenGenerator';
import { UserInfo } from 'flowcharts-common';

export class User implements Authorizable {
    @Expose({ name: 'password_hash' }) private passwordHash?: string;
    @Expose({ name: 'profile_picture' }) private profilePicture?: string;

    constructor(
        private passwordHasher: PasswordHasher,
        private authTokenGenerator: AuthTokenGenerator,
        public id: number,
        public username: string,
        passwordHash: string | undefined,
        profilePicure?: string,
    ) {
        this.passwordHash = passwordHash;
        this.profilePicture = profilePicure;
    }

    /**
     * Inject dependencies from DI container.
     *
     * This can be used to inject dependencies after User instance was constructed without
     * constructor call (for example with plainToClass).
     *
     * @param container inversify container.
     */
    public injectDependencies(container: Container) {
        this.passwordHasher = container.get<PasswordHasher>(types.PasswordHasher);
        this.authTokenGenerator = container.get<AuthTokenGenerator>(types.AuthTokenGenerator);
    }

    /**
     * Set new user password.
     *
     * This hashes password and updates password hash.
     *
     * @param password new password
     * @return User this user instance, after password update is completed.
     */
    public updatePassword(password: string): Promise<User> {
        return this.passwordHasher.hash(password)
            .then((hash: string) => {
                this.passwordHash = hash;
                return this;
            });
    }

    /**
     * Check password to match user password hash.
     *
     * @return Promise<boolean> if password is correct.
     */
    public verifyPassword(password: string): Promise<boolean> {
        if (this.passwordHash === undefined) {
            return Promise.resolve(false);
        }

        return this.passwordHasher.verify(password, this.passwordHash);
    }

    /**
     * Generate auth token for this user, for identification purposes.
     *
     * This token is safe to be stored in cookies or any other client-side storage.
     *
     * @return string token
     */
    public generateAuthToken(): Promise<string> {
        return this.authTokenGenerator.generateToken(this);
    }

    public toUserInfo(): UserInfo {
       return ({
           id: this.id,
           username: this.username,
           profilePicture: this.profilePicture,
       });
    }
}
