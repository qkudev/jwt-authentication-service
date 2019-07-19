import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdentityModule } from './identity/module';
import { TokenModule } from './token/module';
import { AuthorizationMiddleware } from './utils';

@Module({
  imports: [IdentityModule, TokenModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(AuthorizationMiddleware).forRoutes('*');
  }
}
