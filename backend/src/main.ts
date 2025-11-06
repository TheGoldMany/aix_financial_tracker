import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Pénzügyi Követő API')
    .setDescription(
      'Comprehensive personal finance and business accounting system API for the Hungarian market',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('dashboard', 'Dashboard and statistics')
    .addTag('incomes', 'Income management')
    .addTag('expenses', 'Expense management')
    .addTag('categories', 'Category management')
    .addTag('savings', 'Savings management')
    .addTag('accounting', 'Accounting (Pro)')
    .addTag('invoices', 'Invoice management (Pro)')
    .addTag('subscription', 'Subscription management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = configService.get('BACKEND_PORT') || 3001;
  await app.listen(port);

  console.log(`
    🚀 Application is running on: http://localhost:${port}
    📚 API Documentation: http://localhost:${port}/api
    🌍 Environment: ${configService.get('NODE_ENV')}
  `);
}

bootstrap();
