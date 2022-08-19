import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StocksSearchDto } from '../dto/StocksSearchDto';
import { StockSearchPipe } from './stock.search.pipe';

const START = 1659861386;
const END = 1659861390;

describe('System header validation service', () => {
  let service: StockSearchPipe;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockSearchPipe],
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          load: [() => ({ START_TIME: START, END_TIME: END })],
        }),
      ],
    }).compile();
    service = module.get<StockSearchPipe>(StockSearchPipe);
  });

  describe('All ', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Start time before start in  ENV config', async () => {
      try {
        await service.transform(<StocksSearchDto>{
          start_time: START - 1,
          end_time: START + 1,
        });
      } catch (err) {
        const msg = `Start time cannot be prior ${new Date(
          START * 1000,
        ).toISOString()}`;
        expect(err.validationErrors.errors.start_time).toContain(msg);
      }
    });

    it('End time past end in  ENV config', async () => {
      try {
        await service.transform(<StocksSearchDto>{
          start_time: START + 1,
          end_time: END + 1,
        });
      } catch (err) {
        const msg = `End time cannot be past ${new Date(
          END * 1000,
        ).toISOString()}`;
        expect(err.validationErrors.errors.end_time).toContain(msg);
      }
    });

    it('Start time past end time ', async () => {
      try {
        await service.transform(<StocksSearchDto>{
          start_time: END - 1,
          end_time: START + 1,
        });
      } catch (err) {
        const msg = `Start time cannot be past end time`;
        expect(err.validationErrors.errors.start_time).toContain(msg);
      }
    });

    it('Start time same as end time ', async () => {
      try {
        await service.transform(<StocksSearchDto>{
          start_time: END - 1,
          end_time: END - 1,
        });
      } catch (err) {
        const msg = `Start time cannot be the same as end time `;
        expect(err.validationErrors.errors.start_time).toContain(msg);
      }
    });
  });
});
