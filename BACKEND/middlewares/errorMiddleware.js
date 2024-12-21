// ErrorHandler class to standardize error responses
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  // Middleware for handling errors
  export const errorMiddleware = (err, req, res, next) => {
    // Default error messages and codes
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Handle duplicate key errors (MongoDB)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid JSON Web Token errors
    if (err.name === "JsonWebTokenError") {
      const message = "Json Web Token is invalid, Try again!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle expired JSON Web Token errors
    if (err.name === "TokenExpiredError") {
      const message = "Json Web Token is expired, Try again!";
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid MongoDB ObjectId errors
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}: ${err.value}`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle validation errors (e.g., Mongoose validation)
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    // Return a standardized error response
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  // Catch invalid JSON syntax errors globally
  export const invalidJsonMiddleware = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON payload.",
      });
    }
    next(err);
  };
  
  export default ErrorHandler;
  