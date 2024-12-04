// ! Type to represent metadata for pagination in API responses
export type TMeta = {
  limit: number; // * The number of items per page
  page: number; // * The current page number
  total: number; // * The total number of items available
  totalPage: number; // * The total number of pages available
};

// ! Generic type for API response structure
export type TResponse<T> = {
  success: boolean; // * Indicates if the request was successful or not
  statusCode: number; // * HTTP status code (e.g., 200 for success, 404 for not found)
  message?: string; // ? Optional message, useful for error or info messages
  meta?: TMeta; // ? Optional metadata, used when the response includes pagination info
  token?: string; // ? Optional token, returned for authentication purposes (e.g., access token)
  data: T; // * The actual data returned in the response (of type T, making it flexible for various data structures)
};
