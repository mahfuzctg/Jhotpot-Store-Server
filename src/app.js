"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser")); // Middleware for parsing cookies
const cors_1 = __importDefault(require("cors")); // Middleware for enabling Cross-Origin Resource Sharing (CORS)
const express_1 = __importDefault(require("express")); // Importing express and required types
const http_status_1 = __importDefault(require("http-status")); // HTTP status codes library
// Import custom middlewares for global error handling and handling non-existing routes
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
// Importing the router that contains all API routes
const routes_1 = __importDefault(require("./routes"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const app = (0, express_1.default)(); // Initialize an express application
// CORS configuration - Allow cross-origin requests from specific origin and enable credentials (cookies, tokens)
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"], // Allow requests from localhost:3000 (frontend)
    credentials: true, // Allow sending cookies and authentication headers
}));
// Cookie parser middleware - to parse cookies from incoming requests
app.use((0, cookie_parser_1.default)());
// JSON and URL-encoded data parsers - to handle request bodies in these formats
app.use(express_1.default.json()); // Middleware to parse JSON request body
app.use(express_1.default.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (like form submissions)
// Registering the main API routes under the `/api` prefix
app.use("/api", routes_1.default);
// Simple test route for checking if the server is running
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Welcome to Jhotpot-Store Server!😊", // Server health check message
    });
});
// Global error handler - to handle all errors thrown in the app
app.use(globalErrorHandler_1.default);
// Middleware to handle non-existing routes and send a 404 response if the route is not found
app.use(notFound_1.default);
exports.default = app; // Exporting the app to be used in the server setup
