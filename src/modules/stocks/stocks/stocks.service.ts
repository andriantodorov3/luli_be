import { Injectable } from '@nestjs/common';
import { DatageneratorService } from '../datagenerator/datagenerator.service';
import { SearchResult } from '../datagenerator/interfaces/SearchResult';
import { StocksSearchDto } from './dto/StocksSearchDto';

import Piscina from 'piscina';
import { resolve } from 'path';
@Injectable()
export class StocksService {

    private pool: Piscina;
    constructor(private dataService: DatageneratorService
    ) {
        this.pool = new Piscina({
            filename: resolve(__dirname, 'workers/index.js'),
        });
    }

    async searchStocks(stocksSearchDto: StocksSearchDto) {

        return await this.pool.run({ arr: this.dataService.data.items, min_tstamp: stocksSearchDto.start_time, max_tstamp: stocksSearchDto.end_time }, { name: 'calcDiff' });

    }

}
