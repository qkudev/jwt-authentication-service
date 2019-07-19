import { Injectable, Provider } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class StorageService {
  public readonly client: redis.RedisClient;

  constructor() {
    this.client = redis.createClient(6379);
  }

  get(key: string): Promise<any> {
    return new Promise(((resolve, reject) => {
      this.client.get(key, (err, res) =>
        err ? reject(err) : resolve(res));
    }));
  }

  set(key: string, value: string): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.client.set(key, value, (err, res) =>
        err ? reject(err) : resolve(res));
    }));
  }

  del(key: string) {
    return new Promise(((resolve, reject) => {
      this.client.del(key, ((err, reply) =>
        err ? reject(err) : resolve(reply)));
    }));
  }
}

export const StorageServiceType = Symbol('StorageService');

export const StorageServiceProvider: Provider = {
  provide: StorageServiceType,
  useClass: StorageService,
};
