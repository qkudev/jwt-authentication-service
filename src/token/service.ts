import { Inject, Injectable, Provider } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import appConfig from 'config';
import { StorageService } from 'storage/service';
import { IdentityService } from 'identity/service';

import {
  BlacklistedTokenException,
  DifferentIdentitiesException,
  TokenExpiredException,
} from './errors';

const uuid4 = require('uuid/v4');

const { jwt: config } = appConfig;

@Injectable()
export class TokenService {
  public static readonly Type = Symbol('TokenService');

  private readonly accessTokenOptions: {
    secret: string;
    algorithm: string;
    expiresIn: string | number;
  };

  private readonly refreshOptions: {
    secret: string;
    algorithm: string;
    expiresIn: string | number;
  };

  constructor(
    @Inject(StorageService.Type)
    private readonly storage: StorageService,
    @Inject(IdentityService.Type)
    private readonly identityService: IdentityService,
  ) {
    this.accessTokenOptions = {
      secret: config.accessSecret,
      algorithm: config.algorithm,
      expiresIn: config.accessExpiresIn,
    };

    this.refreshOptions = {
      secret: config.refreshSecret,
      algorithm: config.algorithm,
      expiresIn: config.refreshExpiresIn,
    };
  }

  async generate(identityId: string, tokenType: TokenType): Promise<string> {
    const token: Token<typeof tokenType> = {
      id: uuid4(),
      type: tokenType,
      identity: identityId,
      createdAt: new Date(),
    };

    if (tokenType === 'ACCESS') {
      const { secret, ...options } = this.accessTokenOptions;

      return await jwt.sign(token, secret, options);
    } else {
      await this.identityService.appendRefreshToken(token.identity, token.id);
      const { secret, ...options } = this.refreshOptions;

      return await jwt.sign(token, secret, options);
    }
  }

  async verify(
    signedToken: string,
    tokenType: TokenType,
  ): Promise<Token<typeof tokenType>> {
    try {
      const secret =
        tokenType === 'ACCESS'
          ? this.accessTokenOptions.secret
          : this.refreshOptions.secret;

      const token = (await jwt.verify(signedToken, secret)) as Token<
        typeof tokenType
      >;
      if (await this.isBlacklisted(token.id)) {
        throw new BlacklistedTokenException();
      }

      return token;
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      } else {
        throw e;
      }
    }
  }

  async refresh(signedRefreshToken: string): Promise<SignedTokenPair> {
    const refreshToken = await this.verify(signedRefreshToken, 'REFRESH');
    await this.blacklist(refreshToken.id, refreshToken.identity);

    return await this.generateTokenPair(refreshToken.identity);
  }

  async blacklist(tokenId: string, identityId?: string): Promise<void> {
    if (identityId) {
      await this.identityService.removeRefreshToken(identityId, tokenId);
    }

    return new Promise((resolve, reject) => {
      this.storage.client.set(
        `blacklist-${tokenId}`,
        'true',
        'EX',
        1000 * 3600 * 24 * 7,
        err => (err ? reject(err) : resolve()),
      );
    });
  }

  async isBlacklisted(tokenId: string): Promise<boolean> {
    return !!(await this.storage.get(`blacklist-${tokenId}`));
  }

  async generateTokenPair(identityId: string): Promise<SignedTokenPair> {
    return {
      access: await this.generate(identityId, 'ACCESS'),
      refresh: await this.generate(identityId, 'REFRESH'),
    };
  }

  async logout(signedAccess: string, signedRefresh: string): Promise<void> {
    const access = await this.verify(signedAccess, 'ACCESS');
    const refresh = await this.verify(signedRefresh, 'REFRESH');

    if (access.identity !== refresh.identity) {
      throw new DifferentIdentitiesException();
    }

    await this.blacklist(access.id);
    await this.blacklist(refresh.id, refresh.identity);
  }
}

export const TokenServiceProvider: Provider = {
  provide: TokenService.Type,
  useClass: TokenService,
};
