import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { SuccessResponse } from '../utils';

import { IdentityService } from './service';
import * as DTO from './dto';

@Controller('identity')
export class IdentityController {
  constructor(
    @Inject(IdentityService.Type)
    private readonly identityService: IdentityService,
  ) {}

  @Post()
  async create(
    @Body() data: DTO.CreateRequest,
  ): Promise<SuccessResponse<Identity>> {
    const { data: identityData } = data;
    const identity = await this.identityService.create(identityData);

    return new SuccessResponse(identity);
  }

  @Get(':identityId')
  async getById(
    @Param('identityId') identityId: string,
  ): Promise<SuccessResponse<Identity>> {
    const identity = await this.identityService.findById(identityId);

    return new SuccessResponse(identity);
  }

  @Post(':identityId')
  async updateDataById(
    @Param('identityId') identityId: string,
    @Body() data: DTO.CreateRequest,
  ): Promise<SuccessResponse<Identity>> {
    const { data: identityData } = data;
    const identity = await this.identityService.updateDataById(
      identityId,
      identityData,
    );

    return new SuccessResponse(identity);
  }

  @Delete(':identityId')
  async deleteById(
    @Param('identityId') identityId: string,
  ): Promise<SuccessResponse> {
    await this.identityService.deleteById(identityId);

    return new SuccessResponse();
  }
}
