/**

* Custom error classes for the application

*/
 
export class AuthenticationError extends Error {

    public statusCode: number;

    constructor(message: string = "Authentication failed") {

        super(message);

        this.name = "AuthenticationError";

        this.statusCode = 401;

    }

}
 
export class AuthorizationError extends Error {

    public statusCode: number;

    constructor(message: string = "Authorization failed") {

        super(message);

        this.name = "AuthorizationError";

        this.statusCode = 403;

    }

}
 
export class ValidationError extends Error {

    public statusCode: number;

    constructor(message: string = "Validation failed") {

        super(message);

        this.name = "ValidationError";

        this.statusCode = 400;

    }

}
