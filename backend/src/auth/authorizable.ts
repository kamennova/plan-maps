/**
 * Authorizable represents entities, which can be authorized into the system.
 *
 * The only part of the interface is numeric id, which can be used later for
 * session token generation purposes.
 */
export interface Authorizable {
    readonly id: number;
}
