import { Module } from '@nestjs/common';
import { StorageServiceProvider } from './service';

@Module({
  providers: [StorageServiceProvider],
  exports: [StorageServiceProvider],
})
export class StorageModule {}
