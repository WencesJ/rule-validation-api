const profile = require('./profile');
const { rule_validate } = require('./../validation/validator');
const AppError = require('./../Error/AppError');

// GET ME
exports.getMe = (req, res, next) => {

    res.status(200).json({
        message: "My Rule-Validation Api",
        status: MSG.SUCCESS,
        data: profile
    });

    next();
};

// VALIDATE RULE
exports.validateRule = (req, res, next) => {

    const { error, value } = rule_validate(req.body);

    if (error) {
        return next(new AppError(error.msg, error.data));
    }

    res.status(200).json({
        value
    })
}
