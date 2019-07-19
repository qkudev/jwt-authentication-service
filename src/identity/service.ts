import { Inject, Injectable, Provider } from '@nestjs/common';
import { StorageService } from 'storage/service';

import { IdentityNotFound } from './errors';

const uuid4 = require('uuid/v4');

@Injectable()
export class IdentityService {
  public static readonly Type = Symbol('IdentityService');

  constructor(
    @Inject(StorageService.Type)
    private readonly storage: StorageService,
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
    await this.storage.set(`identity-${identityId}`, JSON.stringify(identity));

    return identity;
  }

  async appendRefreshToken(
    identityId: string,
    tokenId: string,
  ): Promise<Identity> {
    const identity = await this.findById(identityId);

    identity.refreshTokens = [tokenId, ...identity.refreshTokens];
    identity.updatedAt = new Date();
    await this.storage.set(`identity-${identityId}`, JSON.stringify(identity));

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
    await this.storage.set(`identity-${identityId}`, JSON.stringify(identity));

    return identity;
  }

  async findById(identityId: string): Promise<Identity> {
    try {
      const identityStr = await this.storage.get(`identity-${identityId}`);

      return JSON.parse(identityStr) as Identity;
    } catch (e) {
      throw new IdentityNotFound();
    }
  }

  async updateDataById(
    identityId: string,
    data: any = null,
  ): Promise<Identity> {
    try {
      const identity = await this.findById(identityId);

      identity.data = data;
      identity.updatedAt = new Date();
      await this.storage.set(
        `identity-${identity.id}`,
        JSON.stringify(identity),
      );

      return identity;
    } catch (e) {
      throw new IdentityNotFound();
    }
  }

  async deleteById(identityId: string): Promise<void> {
    await this.storage.del(`identity-${identityId}`);
  }
}

export const IdentityServiceProvider: Provider = {
  provide: IdentityService.Type,
  useClass: IdentityService,
};
