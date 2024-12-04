// ! Extending the Express Request interface to include a 'user' property
declare global {
  namespace Express {
    // ! This interface defines the structure of the 'Request' object in Express
    interface Request {
      // * The 'user' property will store the decoded JWT payload, typically containing user details like id, email, and role
      user: JwtPayload; // * The user is expected to be an object that comes from a JWT verification middleware
    }
  }
}
