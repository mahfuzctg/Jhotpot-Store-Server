"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // , Import the Express application instance, which sets up the routes and middlewares
const config_1 = __importDefault(require("./config")); // , Import configuration settings, including the port number
const seed_1 = require("./utils/seed"); // , Import the function to seed the super admin data into the database
// ! Main function that initializes the server and handles error events
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // * Seed the super admin data into the database before starting the server
        yield (0, seed_1.seedSuperAdmin)();
        // * Start the server and listen on the port specified in the config
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Server is running on port ${config_1.default.port}`); // * Log that the server is running and listening on the port
        });
        // * Function to handle cleanup and close the server gracefully in case of errors
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.info("Server closed!"); // * Log when the server is successfully closed
                });
            }
            process.exit(1); // * Exit the process with status code 1, indicating an error occurred
        };
        // * Event listener for uncaught exceptions (unexpected errors in synchronous code)
        process.on("uncaughtException", (error) => {
            console.log(error); // * Log the uncaught exception to the console
            exitHandler(); // * Call exit handler to close the server and exit the process
        });
        // * Event listener for unhandled promise rejections (errors in asynchronous code that weren't caught)
        process.on("unhandledRejection", (error) => {
            console.log(error); // * Log the unhandled promise rejection to the console
            exitHandler(); // * Call exit handler to close the server and exit the process
        });
    });
}
// ! Invoke the main function to start the application and handle errors
main();
