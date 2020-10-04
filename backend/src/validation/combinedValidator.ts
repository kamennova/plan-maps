import { Validator } from './validator';
import { Verdict } from './verdict';

/**
 * This groups together multiple validators.
 *
 * Verdict is positive when and only when all dependent validators return
 * positive verdict.
 *
 * When one validator returns negative verdict, the following are skipperd.
 */
const validator = <T> (...pipeline: Array<Validator<T>>): Validator<T> =>
    async (value: T): Promise<Verdict> => {
        const first = pipeline[0];
        if (first === undefined) {
            return Verdict.positive();
        }

        const verdict = await first(value);
        if (!verdict.isPositive) {
            return verdict;
        }

        return await validator<T>(...pipeline.slice(1))(value);
    };

export default validator;
