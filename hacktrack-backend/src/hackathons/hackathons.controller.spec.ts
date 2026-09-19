import { Test, TestingModule } from '@nestjs/testing';
import { HackathonsController } from './hackathons.controller';

describe('HackathonsController', () => {
  let controller: HackathonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackathonsController],
    }).compile();

    controller = module.get<HackathonsController>(HackathonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
