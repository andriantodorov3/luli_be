import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatageneratorService } from '../datagenerator/datagenerator.service';
import { DataStocksArray } from '../datagenerator/interfaces/DataStocksArray';
import { DataStocksPoint } from '../datagenerator/interfaces/DataStocksPoint';
import { StocksService } from './stocks.service';

describe('StocksService', () => {
  let service: StocksService;
  let datageneratorService: DatageneratorService;

  const START = 1659861386;
  const END = 1659861390;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocksService,
        DatageneratorService
      ],
      imports: [ConfigModule.forRoot({
        ignoreEnvVars: true,
        ignoreEnvFile: true,
        load: [() => ({ START_TIME: START, END_TIME: END })],
      })
      ]
    }).compile();

    service = module.get<StocksService>(StocksService);
    datageneratorService = module.get<DatageneratorService>(DatageneratorService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('testing', () => {
    const result = <DataStocksArray>{
      items: [<DataStocksPoint>{
        tstamp: 123,
        value: 234
      },
      <DataStocksPoint>{
        tstamp: 124,
        value: 5
      },
      ]

    };
    jest.spyOn(datageneratorService, 'generateData').mockImplementation(() => result);


  });
});
