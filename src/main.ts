import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거 => 의도하지 않은 데이터 방지
      forbidNonWhitelisted: true, // DTO에 없는 속성 있으면 에러
      transform: true, // 타입 자동 변환 (string → number 등)
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS Study API')
    .setDescription('NestJS Study API documentation')
    .setVersion('1.0')
    .addServer('http://localhost:1027', 'Local Environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(1027);
}
void bootstrap();
