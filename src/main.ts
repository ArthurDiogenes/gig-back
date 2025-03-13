import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  //Habilitando CORS
  const allowedOrigins = [process.env.URL_FRONTEND];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Access-Control-Allow-Headers',
      'Authorization',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 5500);
}
bootstrap();
