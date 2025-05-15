import { Test, TestingModule } from '@nestjs/testing';
import { MpbricksService } from './mpbricks.service';

describe('MpbricksService', () => {
  let service: MpbricksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MpbricksService],
    }).compile();

    service = module.get<MpbricksService>(MpbricksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
