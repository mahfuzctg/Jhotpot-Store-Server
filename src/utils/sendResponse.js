"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ! A generic function to send standardized responses with status, message, and data
const sendResponse = (res, data) => {
    // * Sending the response with the provided data, including status, message, and other relevant info
    return res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data === null || data === void 0 ? void 0 : data.success, // * Indicates whether the request was successful or not
        statusCode: data === null || data === void 0 ? void 0 : data.statusCode, // * The HTTP status code to send in the response
        message: data === null || data === void 0 ? void 0 : data.message, // * The message to include in the response
        meta: data === null || data === void 0 ? void 0 : data.meta, // ? Any additional meta information (optional)
        token: data === null || data === void 0 ? void 0 : data.token, // ? Token to include, if applicable (e.g., for authentication)
        data: data === null || data === void 0 ? void 0 : data.data, // * The actual data to be sent in the response
    });
};
exports.default = sendResponse;
