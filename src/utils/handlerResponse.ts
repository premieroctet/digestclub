export const ApiErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  MISSING_PARAMETERS: 'Missing parameters',
} as const;

type ApiErrorMessagesType =
  (typeof ApiErrorMessages)[keyof typeof ApiErrorMessages];

export class HandlerApiError {
  static json(body: any, status: number = 200): Response {
    return Response.json(body, {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  static error(message: ApiErrorMessagesType, status: number): Response {
    return this.json({ error: message }, status);
  }

  static unauthorized(): Response {
    return this.error(ApiErrorMessages.UNAUTHORIZED, 401);
  }

  static missingParameters(): Response {
    return this.error(ApiErrorMessages.MISSING_PARAMETERS, 400);
  }

  static rateLimitExceeded(): Response {
    return this.error(ApiErrorMessages.RATE_LIMIT_EXCEEDED, 429);
  }

  static internalServerError(): Response {
    return this.error(ApiErrorMessages.INTERNAL_SERVER_ERROR, 500);
  }
}

export class HandlerApiResponse {
  static json(body: any, status: number = 200): Response {
    return Response.json(body, {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  static success(body: any, status: number = 200): Response {
    return this.json({ body }, status);
  }

  static created(body: any): Response {
    return this.success(body, 201);
  }

  static noContent(): Response {
    return this.success(null, 204);
  }

  static ok(body: any): Response {
    return this.success(body, 200);
  }
}
