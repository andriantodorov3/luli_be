import { Module } from '@nestjs/common';
import { StocksModule } from './modules/stocks/stocks.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StocksModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule { }
