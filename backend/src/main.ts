import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT ?? '5001', 10);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('University Canteen Management System API')
    .setDescription('Backend API for the University Canteen Management System (UCMS)')
    .setVersion('1.0')
    .addBearerAuth()

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI at http://localhost:${port}/api`);
}
bootstrap();
