/* eslint-disable no-console */
import { Server } from "http"; // , Import the Server class from the 'http' module to handle HTTP server
import app from "./app"; // , Import the Express application instance, which sets up the routes and middlewares
import config from "./config"; // , Import configuration settings, including the port number
import { seedSuperAdmin } from "./utils/seed"; // , Import the function to seed the super admin data into the database

// ! Main function that initializes the server and handles error events
async function main() {
  // * Seed the super admin data into the database before starting the server
  await seedSuperAdmin();

  // * Start the server and listen on the port specified in the config
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`); // * Log that the server is running and listening on the port
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
}

// ! Invoke the main function to start the application and handle errors
main();
