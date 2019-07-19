import { Module } from '@nestjs/common';
import { StorageModule } from 'storage/module';
import { IdentityModule } from 'identity/module';

import { TokenServiceProvider } from './service';

@Module({
  imports: [StorageModule, IdentityModule],
  providers: [TokenServiceProvider],
  exports: [TokenServiceProvider],
})
export class TokenModule {}
