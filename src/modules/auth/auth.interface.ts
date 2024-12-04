// * Type definition for a standard login user
export type TLoginUser = {
  email: string; // * Email address of the user, required for authentication
  password: string; // * Password of the user, required for authentication
};

// * Type definition for a social login user
export type TSocialLoginUser = {
  name: string; // * Full name of the user, typically retrieved from the social login provider
  profilePhoto: string; // * Profile photo URL of the user, typically retrieved from the social login provider
  email: string; // !! Email address is required for uniquely identifying the user in the system
  password?: string; // ? Optional password field in case the user sets one after initial social login
};
