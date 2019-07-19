import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/module';
import { TokenModule } from './token/module';

@Module({
  imports: [IdentityModule, TokenModule],
})
export class AppModule {}
