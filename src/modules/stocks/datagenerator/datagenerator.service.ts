import { Injectable } from '@nestjs/common';

import { ConfigService } from "@nestjs/config";
import { DataStocksArray } from './interfaces/DataStocksArray';
@Injectable()
export class DatageneratorService {

    data: DataStocksArray;

    constructor(private configService: ConfigService) {
        this.data = this.generateData();
    }

    generateData() {

        const configStartTime = this.configService.get<number>('START_TIME');
        const configEndTime = this.configService.get<number>('END_TIME');

        const data = { items: [] };
        for (let i: number = configStartTime; i <= configEndTime; i++) {
            data.items.push({
                tstamp: i,
                value: this.makeRandomValue()
            })

        }
        return data as DataStocksArray;
    }

    makeRandomValue(min = 10, max = 100) {
        return Math.floor(Math.random() * (max - min + 1) + min);;
    }

}
