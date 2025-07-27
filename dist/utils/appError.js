"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = void 0;
const appError = (res, message, error, statusCode = 400) => {
    res.status(statusCode).json({
        message,
        success: false,
        error,
    });
};
exports.appError = appError;
