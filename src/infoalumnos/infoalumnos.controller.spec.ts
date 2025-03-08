import { Test, TestingModule } from '@nestjs/testing';
import { InfoalumnosController } from './infoalumnos.controller';

describe('InfoalumnosController', () => {
  let controller: InfoalumnosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoalumnosController],
    }).compile();

    controller = module.get<InfoalumnosController>(InfoalumnosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
