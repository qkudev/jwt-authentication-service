import { Allow } from 'class-validator';

export class CreateRequest {
  @Allow()
  data?: any;
}
