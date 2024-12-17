import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing (CORS)
import express, { Application, Request, Response } from "express"; // Importing express and required types
import httpStatus from "http-status"; // HTTP status codes library

// Import custom middlewares for global error handling and handling non-existing routes
import globalErrorHandler from "./middlewares/globalErrorHandler";


// Importing the router that contains all API routes
import router from "./routes";
import notFound from "./middlewares/notFound";

const app: Application = express(); // Initialize an express application

// CORS configuration - Allow cross-origin requests from specific origin and enable credentials (cookies, tokens)
app.use(
  cors({
    origin: ["http://localhost:3000", "https://jhotpot-store-client.vercel.app"], // Allow requests from localhost:3000 (frontend)
    credentials: true, // Allow sending cookies and authentication headers
  })
);

// Cookie parser middleware - to parse cookies from incoming requests
app.use(cookieParser());

// JSON and URL-encoded data parsers - to handle request bodies in these formats
app.use(express.json()); // Middleware to parse JSON request body
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (like form submissions)

// Registering the main API routes under the `/api` prefix
app.use("/api", router);

// Simple test route for checking if the server is running
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Jhotpot-Store Server!😊", // Server health check message
  });
});

// Global error handler - to handle all errors thrown in the app
app.use(globalErrorHandler);

// Middleware to handle non-existing routes and send a 404 response if the route is not found
app.use(notFound);

export default app; // Exporting the app to be used in the server setup
