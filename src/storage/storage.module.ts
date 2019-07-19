import { Module } from '@nestjs/common';
import { StorageServiceProvider } from './storage.service';

@Module({
  providers: [StorageServiceProvider],
  exports: [StorageServiceProvider],
})
export class StorageModule {
}
