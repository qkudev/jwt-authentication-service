import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        success: false,
        error: 'TokenExpiredError',
        message: 'Token has been expired',
        statusCode: 419,
      },
      419,
    );
  }
}

export class BlacklistedTokenException extends HttpException {
  constructor() {
    super(
      {
        success: false,
        error: 'BlacklistedTokenError',
        message: 'Token is blacklisted',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DifferentIdentitiesException extends HttpException {
  constructor() {
    super(
      {
        success: false,
        error: 'DifferentIdentitiesError',
        message:
          'Identity ID of access token is not equal to identity ID of refresh token',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
