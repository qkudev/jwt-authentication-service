import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

import { app } from '../config';

const IORedis = require('ioredis');
const IORedisMock = require('ioredis-mock');

export type StorageService = Redis;

export const StorageServiceType = Symbol('StorageService');

export const StorageServiceProvider: Provider = {
  provide: StorageServiceType,
  useClass: app.nodeEnv === 'test' ? IORedisMock : IORedis,
};
