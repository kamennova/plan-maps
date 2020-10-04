import { Authorizable } from '../authorizable';

/**
 * JSON Web Token.
 *
 * This token contains only user id which should be just enough to indentify user
 * and fetch additional details from the database.
 *
 * JWTs are signed with app secret. Each token has a lifetime limited by
 * `expiresIn` duration ( @see JwtTokenGenerator ).
 *
 * @see https://jwt.io/
 */
export class JwtToken {
    public userId: number;

    constructor(user: Authorizable) {
        this.userId = user.id;
    }
}
