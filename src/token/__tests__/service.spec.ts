import { Test, TestingModule } from '@nestjs/testing';

import {
  IdentityService,
  IdentityServiceProvider,
} from '../../identity/service';
import { StorageServiceProvider } from '../../storage/service';
import { TokenService, TokenServiceProvider } from '../service';

describe('Token::Service', () => {
  let service: TokenService;
  let identityService: IdentityService;
  let identity1: Identity;
  let identity2: Identity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenServiceProvider,
        IdentityServiceProvider,
        StorageServiceProvider,
      ],
      exports: [TokenServiceProvider],
    }).compile();

    service = module.get<TokenService>(TokenService.Type);
    identityService = module.get<IdentityService>(IdentityService.Type);
    identity1 = await identityService.create();
    identity2 = await identityService.create();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(identityService).toBeDefined();
    expect(identity1).toBeDefined();
  });

  it('should generate token pair', async () => {
    const pair = await service.generateTokenPair(identity1.id);

    expect(pair.access).toBeTruthy();
    expect(pair.refresh).toBeTruthy();
  });

  it('should generate access token', async () => {
    const signedAccess = await service.generate(identity1.id, 'ACCESS');
    const signedRefresh = await service.generate(identity1.id, 'REFRESH');

    const access = await service.verify(signedAccess, 'ACCESS');
    const refresh = await service.verify(signedRefresh, 'REFRESH');

    expect(access.type).toEqual('ACCESS');
    expect(refresh.type).toEqual('REFRESH');
  });

  it('should logout successfully', async () => {
    const signedPair = await service.generateTokenPair(identity1.id);
    await service.logout(signedPair.access, signedPair.refresh);
  });

  it('should throw DifferentIdentities', async () => {
    const signedPair1 = await service.generateTokenPair(identity1.id);
    const signedPair2 = await service.generateTokenPair(identity2.id);

    try {
      await service.logout(signedPair1.access, signedPair2.refresh);
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('DifferentIdentitiesError');
    }
  });

  it('should throw TokenExpiredException', async () => {
    const signedAccess = await service.generate(identity1.id, 'ACCESS');
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await service.verify(signedAccess, 'ACCESS');
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('TokenExpiredError');
    }
  });

  it('should throw BadTokenException', async () => {
    try {
      await service.verify('notSignedTokenString', 'ACCESS');
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('BadTokenError');
    }
  });

  it('should throw BlacklistedTokenException', async () => {
    const pair = await service.generateTokenPair(identity1.id);
    await service.logout(pair.access, pair.refresh);

    try {
      await service.verify(pair.access, 'ACCESS');
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('BlacklistedTokenError');
    }
  });

  it('should refresh tokens', async () => {
    const signedPair = await service.generateTokenPair(identity1.id);
    const newPair = await service.refresh(signedPair.refresh);

    expect(newPair.access).toBeTruthy();
    expect(newPair.refresh).toBeTruthy();
  });
});
