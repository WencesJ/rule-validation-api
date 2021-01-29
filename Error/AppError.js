class AppError extends Error {
    constructor(message, data) {
        super(message);

        this.statusCode = 400;

        this.status = 'error';

        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
