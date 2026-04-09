import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });
  
  await app.listen(3001);
  console.log(`🚀 Server running on http://localhost:3001`);
}

bootstrap();
