import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatageneratorService } from './datagenerator.service';

describe('DatageneratorService', () => {
  let service: DatageneratorService;

  const START = 1659861386;
  const END = 1659861390;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatageneratorService],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          load: [() => ({ START_TIME: START, END_TIME: END })],
        }),
      ],
    }).compile();

    service = module.get<DatageneratorService>(DatageneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should have generated data array', () => {
    expect(service.data.items.length).toBe(END - START + 1);
  });

  it('Should have correct start timestamp', () => {
    expect(service.data.items[0].tstamp).toBe(START);
  });

  it('Should have correct end timestamp', () => {
    expect(service.data.items[END - START].tstamp).toBe(END);
  });
});
