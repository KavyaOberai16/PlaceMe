//basically error type blueprint which will be used in app.js so that error could be shown like this
class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;