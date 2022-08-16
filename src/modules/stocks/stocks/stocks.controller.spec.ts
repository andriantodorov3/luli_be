import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { SearchResult } from '../datagenerator/interfaces/SearchResult';
import { StocksSearchDto } from './dto/StocksSearchDto';

const moduleMocker = new ModuleMocker(global);

const result = <SearchResult>{
  buy_point: 123,
  buy_point_price: 10,
  sell_point: 133,
  sell_point_price: 100
};

const dto = <StocksSearchDto> {
  start_time: 100,
  end_time: 200
}

describe('StocksController', () => {
  let controller: StocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers:[ ]
    })
    .useMocker((token) => {
      if (token === StocksService) {
        return { searchStocks: jest.fn().mockResolvedValue(result) };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    }).
    compile();

    controller = module.get<StocksController>(StocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('searchStocks', () => {
    it('should return data', async () => {
      expect(await controller.searchStocks(dto)).toBe(result);
    });
  });

});
