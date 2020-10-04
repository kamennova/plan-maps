import { Verdict } from "./verdict";

/**
 * Validator can be defined as a function returning Verdict for any value T.
 *
 * Promise is returned, as Validator may use non-blocking calls (database, IO)
 * to check value.
 */
export type Validator<T> = (value: T) => Promise<Verdict>;
