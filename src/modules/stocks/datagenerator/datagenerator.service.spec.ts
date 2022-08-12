import { Test, TestingModule } from '@nestjs/testing';
import { DatageneratorService } from './datagenerator.service';

describe('DatageneratorService', () => {
  let service: DatageneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatageneratorService],
    }).compile();

    service = module.get<DatageneratorService>(DatageneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
