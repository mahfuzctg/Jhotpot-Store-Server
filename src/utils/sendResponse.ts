import { Response } from "express"; // * Importing Response type from express for proper response handling
import { TResponse } from "../interface/sendResponseInterface"; // * Importing TResponse type for defining the response structure

// ! A generic function to send standardized responses with status, message, and data
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  // * Sending the response with the provided data, including status, message, and other relevant info
  return res.status(data?.statusCode).json({
    success: data?.success, // * Indicates whether the request was successful or not
    statusCode: data?.statusCode, // * The HTTP status code to send in the response
    message: data?.message, // * The message to include in the response
    meta: data?.meta, // ? Any additional meta information (optional)
    token: data?.token, // ? Token to include, if applicable (e.g., for authentication)
    data: data?.data, // * The actual data to be sent in the response
  });
};

export default sendResponse;
