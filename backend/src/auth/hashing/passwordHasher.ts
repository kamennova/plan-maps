/**
 * Interface for password hashing algorithms.
 *
 * Provides `hash` and `verify` methods, both returning Promises as hashing
 * algorithms may have non-blocking implementation.
 *
 * Note: `hash` should not be used only for hashing, not for hash verification,
 * because it may (and should) add random salt.
 */
export interface PasswordHasher {
    hash(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}
