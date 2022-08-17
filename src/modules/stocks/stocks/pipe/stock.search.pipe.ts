import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationException } from 'src/core/validation/validation.filter';

@Injectable()
export class StockSearchPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  transform(value: any) {
    let error = false;
    const errorsResponse = {
      start_time: [],
      end_time: [],
    };

    const configStartTime = this.configService.get<number>('START_TIME');
    const configEndTime = this.configService.get<number>('END_TIME');

    if (value.start_time < configStartTime) {
      error = true;
      errorsResponse.start_time.push(
        `Start time cannot be prior ${new Date(
          <number>configStartTime * 1000,
        ).toISOString()}`,
      );
    }

    if (value.end_time > configEndTime) {
      error = true;
      errorsResponse.end_time.push(
        `Start time cannot be past ${new Date(
          <number>configEndTime * 1000,
        ).toISOString()}`,
      );
    }

    if (value.start_time == value.end_time) {
      error = true;
      errorsResponse.start_time.push(
        `Start time cannot be the same as end time `,
      );
    }

    if (value.start_time > value.end_time) {
      error = true;
      errorsResponse.start_time.push(`Start time cannot be past end time `);
    }

    if (error) {
      throw new ValidationException({ errors: errorsResponse });
    }
    return value;
  }
}
