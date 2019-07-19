import { Test, TestingModule } from '@nestjs/testing';

import { StorageServiceProvider } from '../../storage/service';
import { IdentityService, IdentityServiceProvider } from '../service';

const testTokenID = 'testTokenId';

describe('Identity::Service', () => {
  let service: IdentityService;
  let testIdentity: Identity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageServiceProvider, IdentityServiceProvider],
    }).compile();

    service = module.get<IdentityService>(IdentityService.Type);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create new identity', async () => {
    testIdentity = await service.create('test');

    expect(testIdentity.data).toEqual('test');
  });

  it('should find identity by ID', async () => {
    const identity = await service.findById(testIdentity.id);

    expect(identity).toEqual(JSON.parse(JSON.stringify(testIdentity)));
  });

  it('should throw IdentityNotFound', async () => {
    try {
      await service.findById('wrongID');
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('IdentityNotFound');
    }
  });

  it('should update identity by ID', async () => {
    const updatedIdentity = await service.updateDataById(testIdentity.id, null);

    expect(updatedIdentity.data).toEqual(null);
  });

  it('should add token ID to identity', async () => {
    const updatedIdentity = await service.appendRefreshToken(
      testIdentity.id,
      testTokenID,
    );

    expect(updatedIdentity.refreshTokens).toEqual([testTokenID]);
  });

  it('should remove token ID from identity', async () => {
    const updatedIdentity = await service.removeRefreshToken(
      testIdentity.id,
      testTokenID,
    );

    expect(updatedIdentity.refreshTokens).toEqual([]);
  });

  it('should delete identity by ID', async () => {
    await service.findById(testIdentity.id);
    await service.deleteById(testIdentity.id);

    try {
      await service.findById(testIdentity.id);
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('IdentityNotFound');
    }
  });
});
