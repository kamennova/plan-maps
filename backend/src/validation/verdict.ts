import { ValidationError } from "./validationError";

/**
 * Verdict is a result of validation.
 *
 * Positive verdict means that value passed validation.
 * Negative verdict signals there is a problem. More info in `details` field.
 */
export class Verdict {

    constructor(
        public isPositive: boolean,
        public details?: string,
    ) {}

    public static positive(): Verdict {
        return new Verdict(true);
    }

    public static negative(details: string): Verdict {
        return new Verdict(false, details);
    }

    /**
     * Return positive or negative verdict based on condition.
     *
     * @param condition positive verdict if true.
     * @param details details to be used for negative verdict.
     */
    public static conditional = (condition: boolean, details: string): Verdict =>
        condition ? Verdict.positive() : Verdict.negative(details)

    /**
     * Throw validation error if verdict is negative.
     *
     * @throws ValidatorError error with details why validation has failed.
     */
    public throwErrorOnNegative() {
        if (!this.isPositive) {
            throw new ValidationError(this.details);
        }
    }
}
