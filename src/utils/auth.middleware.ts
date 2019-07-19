import { NestMiddleware } from '@nestjs/common';
import { IncomingMessage, OutgoingMessage } from 'http';

import { app } from '../config';
import { UnauthorizedException } from './errors';

class AuthMiddleware implements NestMiddleware {
  use(req: IncomingMessage, res: OutgoingMessage, next: () => void): any {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const [Bearer, token] = authorization.split(' ');
    if (!(Bearer === 'Bearer' && token === app.apiKey)) {
      throw new UnauthorizedException();
    }

    return next();
  }
}

export default AuthMiddleware;
