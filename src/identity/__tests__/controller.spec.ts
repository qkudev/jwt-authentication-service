import { Test, TestingModule } from '@nestjs/testing';

import { StorageServiceProvider } from '../../storage/service';
import { IdentityServiceProvider } from '../service';
import { IdentityController } from '../controller';
import SuccessResponse from '../../utils/SuccessResponse';

describe('Identity::Controller', () => {
  let controller: IdentityController;
  let testIdentity: Identity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityController],
      providers: [StorageServiceProvider, IdentityServiceProvider],
    }).compile();

    controller = module.get<IdentityController>(IdentityController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should create new identity', async () => {
    const response = await controller.create({});
    testIdentity = response.data;

    expect(response).toEqual(new SuccessResponse(testIdentity));
  });

  it('should return identity by ID', async () => {
    const response = await controller.getById(testIdentity.id);

    expect(response).toEqual(
      JSON.parse(JSON.stringify(new SuccessResponse(testIdentity))),
    );
  });

  it('should throw IdentityNotFoundError', async () => {
    try {
      await controller.getById('wrongID');
    } catch (e) {
      const errorResponse = e.getResponse();
      expect(errorResponse.error).toEqual('IdentityNotFound');
    }
  });

  it('should update identity by ID', async () => {
    const response = await controller.updateDataById(testIdentity.id, {
      data: 'test',
    });

    expect(response.data.data).toEqual('test');
  });

  it('should delete identity by ID', async () => {
    const response = await controller.deleteById(testIdentity.id);

    expect(response).toEqual(new SuccessResponse());
  });
});
