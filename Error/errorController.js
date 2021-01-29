const sendErr = (err, req, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
        data: err.data
    });
};


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    sendErr(err, req, res);
};
