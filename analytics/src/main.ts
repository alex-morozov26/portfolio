import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AxiosRetryStrategy } from './axios-retry.strategy';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  AxiosRetryStrategy.apply();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Analytics API')
    .setDescription(
      'API для управления проектами, источниками данных и синхронизацией. ' +
      'Позволяет получать, синхронизировать и отслеживать данные с разных внешних платформ, ' +
      'а также просматривать логи синхронизации.'
    )
    .setVersion('3.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
