import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
 
  app.useStaticAssets(join(__dirname, '..', 'public'));

    const config = new DocumentBuilder()
    .setTitle('My NestJS API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, 
    transform: true, 
  }),
)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
