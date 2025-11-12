class ApiError extends Error {
  constructor(statusCoe, message) {
    super(message);
    this.name = "ApiError";
    this.statusCoe = statusCoe;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ApiError;
