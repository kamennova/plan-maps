import { Validator } from "./validator";
import { Verdict } from "./verdict";

/**
 * This can be used for any type with length field (for example, for strings or arrays).
 *
 * Verdict is positive when value length is in [minLength; maxLength].
 */
export default
    (fieldName: string, minLength: number, maxLength?: number): Validator<{ length: number }> =>
        (value: { length: number }) => Promise.resolve(Verdict.conditional(
            value.length >= minLength && (maxLength === undefined || value.length <= maxLength),
            `${fieldName} should be at least ${minLength} characters long.`,
        ));
