import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { StocksModule } from './../src/modules/stocks/stocks.module';

import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationFilter, ValidationException } from './../src/core/validation/validation.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let httpServer: any;

  jest.setTimeout(10000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, StocksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.setGlobalPrefix('api/v1');

    app.useGlobalFilters(new ValidationFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        skipMissingProperties: false,
        exceptionFactory: (errors: ValidationError[]) => {
          const errMsg = {};
          errors.forEach(err => {
            errMsg[err.property] = [...Object.values(err.constraints)];
          });
          return new ValidationException(errMsg);
        }
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  //nothing configured besides the search url, expect not found here
  it('Get homepage not found', () => {
    return request(httpServer)
      .get('/')
      .expect(404)
  });

  it('Search with correct params', async (done) => {
    const payload = {
      start_time: 1659940140,
      end_time: 1659940300,
    }
    const response = await request(httpServer)
      .post('/api/v1/stocks/search')
      .send(payload);
    expect(response.status).toBe(200);

    return true;
  });

  it('Search with incorrect params', async (done) => {

    const payload = {
      end_time: 1659940140,
      start_time: 1659940300,
    }
    const response = await request(httpServer)
      .post('/api/v1/stocks/search')
      .send(payload);
    console.log('response', response)
    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
