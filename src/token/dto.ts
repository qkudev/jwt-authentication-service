import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenPairRequest {
  @IsNotEmpty()
  @IsString()
  identity: string;
}

export class VerifyRequest {
  @IsNotEmpty()
  @IsString()
  access_token: string;
}

export class RefreshRequest {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class LogoutRequest {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;

  @IsNotEmpty()
  @IsString()
  access_token: string;
}
