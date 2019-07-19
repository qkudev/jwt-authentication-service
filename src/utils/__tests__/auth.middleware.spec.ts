import { IncomingMessage, OutgoingMessage } from 'http';
import { AuthorizationMiddleware } from '../index';
import { app as config } from '../../config';

const authorizedRequest = {
  headers: {
    authorization: `Bearer ${config.apiKey}`,
  },
} as IncomingMessage;

const unauthorizedRequest = {
  headers: { authorization: undefined },
} as IncomingMessage;

const tokenRequest = {
  headers: { authorization: `TOKEN ${config.apiKey}` },
} as IncomingMessage;

const wrongBearerRequest = {
  headers: {
    authorization: `Bearer ${config.apiKey
      .split('')
      .reverse()
      .join('')}`,
  },
} as IncomingMessage;

const res = {} as OutgoingMessage;

describe('AuthorizationMiddleware', () => {
  const middleware = new AuthorizationMiddleware();

  it('should be successfully used', async () => {
    let success = false;

    middleware.use(authorizedRequest, res, () => (success = true));
    expect(success).toBeTruthy();
  });

  it('should throw UnauthorizedException by no header', async () => {
    try {
      middleware.use(unauthorizedRequest, res, () => null);
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('UnauthorizedError');
    }
  });

  it('should throw UnauthorizedException by no Bearer keyword', async () => {
    try {
      middleware.use(tokenRequest, res, () => null);
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('UnauthorizedError');
    }
  });

  it('should throw UnauthorizedException by wrong Bearer key', async () => {
    try {
      middleware.use(wrongBearerRequest, res, () => null);
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('UnauthorizedError');
    }
  });
});
