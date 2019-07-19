import { Test, TestingModule } from '@nestjs/testing';

import {
  IdentityService,
  IdentityServiceProvider,
} from '../../identity/service';
import { StorageServiceProvider } from '../../storage/service';
import { TokenController } from '../controller';
import { TokenService, TokenServiceProvider } from '../service';
import SuccessResponse from '../../utils/SuccessResponse';

describe('Token::Controller', () => {
  let controller: TokenController;
  let tokenService: TokenService;
  let identityService: IdentityService;

  let identity: Identity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenServiceProvider,
        IdentityServiceProvider,
        StorageServiceProvider,
      ],
      exports: [TokenServiceProvider],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    identityService = module.get<IdentityService>(IdentityService.Type);
    tokenService = module.get<TokenService>(TokenService.Type);

    identity = await identityService.create();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    expect(identityService).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(identity).toBeDefined();
  });

  it('should verify access token', async () => {
    const access = await tokenService.generate(identity.id, 'ACCESS');
    const response = await controller.verify({ access_token: access });

    expect(response).toEqual(
      new SuccessResponse(JSON.parse(JSON.stringify(identity))),
    );
  });

  it('should generate token pair', async () => {
    const response = await controller.generateTokenPair({
      identity: identity.id,
    });

    expect(response).toEqual(new SuccessResponse(response.data));
  });

  it('should refresh tokens', async () => {
    const { refresh } = await tokenService.generateTokenPair(identity.id);
    const response = await controller.refresh({ refresh_token: refresh });

    expect(response.success).toEqual(true);
    expect(response.data.access).toBeTruthy();
    expect(response.data.refresh).toBeTruthy();
  });

  it('should logout', async () => {
    const { access, refresh } = await tokenService.generateTokenPair(
      identity.id,
    );
    const response = await controller.logout({
      access_token: access,
      refresh_token: refresh,
    });

    expect(response).toEqual(new SuccessResponse());
  });
});
