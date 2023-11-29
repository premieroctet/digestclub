export const ApiErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  UNAUTHORIZED: 'Unauthorized',
  RATE_LIMIT_EXCEEDED: 'Rate Limit Exceeded',
  MISSING_PARAMETERS: 'Missing Parameters',
} as const;

type ApiErrorMessagesType =
  (typeof ApiErrorMessages)[keyof typeof ApiErrorMessages];

export class ApiError extends Error {
  constructor(message: ApiErrorMessagesType, public status: number) {
    super(message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super(ApiErrorMessages.UNAUTHORIZED, 401);
  }
}

export class MissingParametersError extends ApiError {
  constructor() {
    super(ApiErrorMessages.MISSING_PARAMETERS, 400);
  }
}

export class RateLimitExceedError extends ApiError {
  constructor() {
    super(ApiErrorMessages.RATE_LIMIT_EXCEEDED, 429);
  }
}

export class InternalServerError extends ApiError {
  constructor() {
    super(ApiErrorMessages.INTERNAL_SERVER_ERROR, 500);
  }
}
