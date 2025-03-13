import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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


  console.log('port:::::', process.env.PORT);
  await app.listen(process.env.PORT ?? 58999);
}
bootstrap();
