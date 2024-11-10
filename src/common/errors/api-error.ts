export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  public static unauthorized(message: string): ApiError {
    return new ApiError(401, message);
  }

  public static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  public static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  public static internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}
