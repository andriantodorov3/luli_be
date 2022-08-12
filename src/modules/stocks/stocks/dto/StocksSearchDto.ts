import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class StocksSearchDto {

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    start_time: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    end_time: number;
}