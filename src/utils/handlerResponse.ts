export const ApiErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  UNAUTHORIZED: 'Unauthorized',
  RATE_LIMIT_EXCEEDED: 'Rate Limit Exceeded',
  MISSING_PARAMETERS: 'Missing Parameters',
} as const;

type ApiErrorMessagesType =
  (typeof ApiErrorMessages)[keyof typeof ApiErrorMessages];

export class HandlerError extends Response {
  constructor(message: ApiErrorMessagesType, public status: number) {
    super(JSON.stringify({ error: message }), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class HandlerUnauthorizedError extends HandlerError {
  constructor() {
    super(ApiErrorMessages.UNAUTHORIZED, 401);
  }
}

export class HandlerMissingParametersError extends HandlerError {
  constructor() {
    super(ApiErrorMessages.MISSING_PARAMETERS, 400);
  }
}

export class HandlerRateLimitExceedError extends HandlerError {
  constructor() {
    super(ApiErrorMessages.RATE_LIMIT_EXCEEDED, 429);
  }
}

export class HandlerInternalServerError extends HandlerError {
  constructor() {
    super(ApiErrorMessages.INTERNAL_SERVER_ERROR, 500);
  }
}

export class HandlerSuccess extends Response {
  constructor(body: any, public status: number) {
    super(JSON.stringify(body), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class HandlerCreatedSuccess extends HandlerSuccess {
  constructor(body: any) {
    super(body, 201);
  }
}

export class HandlerOkSuccess extends HandlerSuccess {
  constructor(body: any) {
    super(body, 200);
  }
}
