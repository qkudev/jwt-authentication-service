import { HttpException, HttpStatus } from '@nestjs/common';

export class IdentityNotFound extends HttpException {
  constructor() {
    super(
      {
        success: false,
        error: 'IdentityNotFound',
        message: 'Identity not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
