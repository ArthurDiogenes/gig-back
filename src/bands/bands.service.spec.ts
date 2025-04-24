import { Test, TestingModule } from '@nestjs/testing';
import { BandsService } from './bands.service';

describe('BandsService', () => {
  let service: BandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BandsService],
    }).compile();

    service = module.get<BandsService>(BandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
