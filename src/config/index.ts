import dotenv from "dotenv";

// Load environment variables from the .env file into process.env
dotenv.config();

export default {
  // The port the application will run on
  port: process.env.PORT,

  // Database connection URL (e.g., MongoDB or PostgreSQL connection string)
  database_url: process.env.DATABASE_URL,

  // The environment the app is running in (e.g., development, production)
  NODE_ENV: process.env.NODE_ENV,

  // The URL of the client (frontend) application
  client_url: process.env.CLIENT_URL,

  // Number of rounds for bcrypt hashing (used for password hashing)
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  // JWT access token secret for signing JWT tokens
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,

  // Expiration time for the JWT access token (e.g., '1h' for 1 hour)
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

  // JWT refresh token secret for signing refresh tokens
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

  // Expiration time for the JWT refresh token (e.g., '7d' for 7 days)
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  // Email of the admin user for accessing the application
  admin_email: process.env.ADMIN_EMAIL,

  // Password for the admin user (should be encrypted in a real application)
  admin_password: process.env.ADMIN_PASSWORD,

  // URL to the admin profile photo (can be used for displaying the admin profile)
  admin_profile_photo: process.env.ADMIN_PROFILE_PHOTO,

  // Store identifier used for managing the store (e.g., an ID for the store)
  store_id: process.env.STORE_ID,

  // A key for signature verification (used for secure signature generation)
  signature_key: process.env.SIGNATURE_KEY,

  // URL for the payment gateway to handle payments
  payment_url: process.env.PAYMENT_URL,

  // URL for verifying payments with the payment gateway
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,

  // Link to the UI for resetting passwords (for the frontend to show reset password page)
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
