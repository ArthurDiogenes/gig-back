import { Test, TestingModule } from '@nestjs/testing';
import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';

describe('BandsController', () => {
  let controller: BandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BandsController],
      providers: [BandsService],
    }).compile();

    controller = module.get<BandsController>(BandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
