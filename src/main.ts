import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFilter, ValidationException } from './core/validation/validation.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
