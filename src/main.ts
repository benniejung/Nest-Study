import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(configService.get('PORT') ?? 3000);
  // console.info('Server is running on port ', configService.get('PORT'));
}
bootstrap();
