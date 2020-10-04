import { Validator } from './validator';
import { Verdict } from "./verdict";

/** This checks if value matches provided regular expression. */
export default (regExp: RegExp, description: string): Validator<string> =>
    (value: string): Promise<Verdict> => Promise.resolve(
        Verdict.conditional(regExp.test(value), description),
    );
