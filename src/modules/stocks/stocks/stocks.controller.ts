import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { StocksSearchDto } from './dto/StocksSearchDto';
import { StockSearchPipe } from './pipe/stock.search.pipe';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
    constructor(private stocksService: StocksService) { }
    @Post('search')
    @UsePipes(StockSearchPipe)
    searchStocks(@Body() dto: StocksSearchDto) {
        return this.stocksService.searchStocks(dto);
    }
}
