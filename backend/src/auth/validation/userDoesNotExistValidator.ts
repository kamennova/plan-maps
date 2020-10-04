import { Database } from '../../database';
import { Validator, Verdict } from '../../validation';

/**
 * This validator checks if username is not already taken.
 * Database is required.
 */
export default (database: Database): Validator<string> =>
    async (username: string): Promise<Verdict> => Verdict.conditional(
        (await database.findUserByUsername(username)) === undefined,
        'User with this username does already exist.',
    );
