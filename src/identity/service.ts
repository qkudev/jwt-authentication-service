import { Inject, Injectable, Provider } from '@nestjs/common';

import { IdentityNotFound } from './errors';
import { StorageServiceType, StorageService } from '../storage/service';

const uuid4 = require('uuid/v4');

@Injectable()
export class IdentityService {
  public static readonly Type = Symbol('IdentityService');

  constructor(
    @Inject(StorageServiceType)
    private readonly redis: StorageService,
  ) {}

  async create(data: any = null): Promise<Identity> {
    const identityId = uuid4();
    const ts = new Date();

    const identity: Identity = {
      id: identityId,
      refreshTokens: [],
      data,
      createdAt: ts,
      updatedAt: ts,
    };
    await this.redis.set(`identity-${identityId}`, JSON.stringify(identity));

    return identity;
  }

  async appendRefreshToken(
    identityId: string,
    tokenId: string,
  ): Promise<Identity> {
    const identity = await this.findById(identityId);

    identity.refreshTokens = [tokenId, ...identity.refreshTokens];
    identity.updatedAt = new Date();
    await this.redis.set(`identity-${identityId}`, JSON.stringify(identity));

    return identity;
  }

  async removeRefreshToken(
    identityId: string,
    tokenId: string,
  ): Promise<Identity> {
    const identity = await this.findById(identityId);

    identity.refreshTokens = identity.refreshTokens.filter(
      id => id !== tokenId,
    );
    identity.updatedAt = new Date();
    await this.redis.set(`identity-${identityId}`, JSON.stringify(identity));

    return identity;
  }

  async findById(identityId: string): Promise<Identity> {
    const identityStr = await this.redis.get(`identity-${identityId}`);
    if (!identityStr) {
      throw new IdentityNotFound();
    }

    return JSON.parse(identityStr) as Identity;
  }

  async updateDataById(
    identityId: string,
    data: any = null,
  ): Promise<Identity> {
    const identity = await this.findById(identityId);

    identity.data = data;
    identity.updatedAt = new Date();
    await this.redis.set(`identity-${identity.id}`, JSON.stringify(identity));

    return identity;
  }

  async deleteById(identityId: string): Promise<void> {
    await this.redis.del(`identity-${identityId}`);
  }
}

export const IdentityServiceProvider: Provider = {
  provide: IdentityService.Type,
  useClass: IdentityService,
};
