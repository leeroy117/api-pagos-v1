import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Pasarela de pagos')
    .setDescription('Con esta API se generan preferencias de pago y se automatizan procesos de pagos')
    .setVersion('1.0')
    .addTag('Endpoint')
    .addServer('/')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, documentFactory);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
  });

  app.useGlobalPipes(new ValidationPipe());
  console.log('port:::::', process.env.PORT);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();
  await app.listen(process.env.PORT ?? 58999);
}
bootstrap();
