import regExpValidator from "./regExpValidator";
import { Validator } from "./validator";

/**
 * This checks if string contains only letters (both lower- and uppercase),
 * numbers, underscores or dots.
 */
export default (fieldName: string): Validator<string> => regExpValidator(
    new RegExp('^[a-zA-Z0-9_\\.]*$'),
    `${fieldName} should be alphanumeric.`,
);
