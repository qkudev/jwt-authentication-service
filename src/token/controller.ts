import { Body, Controller, Inject, Post } from '@nestjs/common';

import { IdentityService } from '../identity/service';
import { SuccessResponse } from '../utils';
import * as DTO from './dto';
import { TokenService } from './service';

@Controller('token')
export class TokenController {
  constructor(
    @Inject(TokenService.Type)
    private readonly tokenService: TokenService,
    @Inject(IdentityService.Type)
    private readonly identityService: IdentityService,
  ) {}

  @Post()
  async generateTokenPair(
    @Body() data: DTO.GenerateTokenPairRequest,
  ): Promise<SuccessResponse<SignedTokenPair>> {
    const { identity } = data;
    const signedTokenPair: SignedTokenPair = await this.tokenService.generateTokenPair(
      identity,
    );

    return new SuccessResponse(signedTokenPair);
  }

  @Post('verify')
  async verify(
    @Body() data: DTO.VerifyRequest,
  ): Promise<SuccessResponse<Identity>> {
    const { access_token: accessToken } = data;
    const token = await this.tokenService.verify(accessToken, 'ACCESS');
    const identity = await this.identityService.findById(token.identity);

    return new SuccessResponse(identity);
  }

  @Post('refresh')
  async refresh(
    @Body() data: DTO.RefreshRequest,
  ): Promise<SuccessResponse<SignedTokenPair>> {
    const { refresh_token: refresh } = data;
    const signedTokenPair = await this.tokenService.refresh(refresh);

    return new SuccessResponse(signedTokenPair);
  }

  @Post('logout')
  async logout(@Body() data: DTO.LogoutRequest): Promise<SuccessResponse> {
    const { access_token: access, refresh_token: refresh } = data;
    await this.tokenService.logout(access, refresh);

    return new SuccessResponse();
  }
}
