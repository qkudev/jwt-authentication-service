import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/module';
import { IdentityServiceProvider } from './service';
import { IdentityController } from './controller';

@Module({
  imports: [StorageModule],
  controllers: [IdentityController],
  providers: [IdentityServiceProvider],
  exports: [IdentityServiceProvider],
})
export class IdentityModule {}
