import { Test, TestingModule } from '@nestjs/testing';
import { MpbricksController } from './mpbricks.controller';

describe('MpbricksController', () => {
  let controller: MpbricksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MpbricksController],
    }).compile();

    controller = module.get<MpbricksController>(MpbricksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
