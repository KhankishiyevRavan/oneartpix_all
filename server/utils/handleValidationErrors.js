module.exports = function handleValidationErrors(res, errors, errCode) {
    if (Object.keys(errors).length) {
        return res.status(errCode).json({  errors });
    }
};