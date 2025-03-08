import { Test, TestingModule } from '@nestjs/testing';
import { InfoalumnosService } from './infoalumnos.service';

describe('InfoalumnosService', () => {
  let service: InfoalumnosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoalumnosService],
    }).compile();

    service = module.get<InfoalumnosService>(InfoalumnosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
