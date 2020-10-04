import { Validator } from './validator';
import { Verdict } from './verdict';

/** Positive verdict is returned for defined values only. */
export default <T> (fieldName: string): Validator<T> =>
    (value: T): Promise<Verdict> => Promise.resolve(Verdict.conditional(
        value !== undefined,
        `${fieldName} should be set.`,
    ));
