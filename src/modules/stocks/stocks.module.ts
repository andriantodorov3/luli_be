import { Module } from '@nestjs/common';
import { StocksService } from './stocks/stocks.service';
import { StocksController } from './stocks/stocks.controller';
import { DatageneratorService } from './datagenerator/datagenerator.service';

@Module({
  providers: [StocksService, DatageneratorService],
  controllers: [StocksController],
})
export class StocksModule { }
