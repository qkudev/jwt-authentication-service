import { Test } from '@nestjs/testing';

import {
  StorageService,
  StorageServiceProvider,
  StorageServiceType,
} from '../service';

describe('Storage::Service', () => {
  let service: StorageService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [StorageServiceProvider],
      exports: [StorageServiceProvider],
    }).compile();

    service = module.get<StorageService>(StorageServiceType);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
