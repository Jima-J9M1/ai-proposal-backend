import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use raw body parser for Stripe webhook
  app.use('/api/v1/payments/webhook', bodyParser.raw({ type: '*/*' }));

  // Use json parser for all other routes
  app.use(bodyParser.json());

  // Enable CORS
  app.enableCors({
    origin: [process.env.VERCEL_CORS_ORIGIN, 'http://localhost:3000',process.env.DOMAIN_CORS_ORIGIN],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('AI Proposal Writer API')
    .setDescription('Backend API for AI Proposal Writer application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('profiles', 'Profile management endpoints')
    .addTag('proposals', 'Proposal management endpoints')
    .addBearerAuth()
    .build();


    // Configure Swagger with elegant dark theme and premium styling
  const swaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      defaultModelsExpandDepth: 1,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      maxDisplayedTags: null,
      showExtensions: true,
      showCommonExtensions: true,
      deepLinking: true,
      layout: 'BaseLayout',
      syntaxHighlight: {
        activate: true,
        theme: 'nord',
      },
      displayOperationId: true,
    },
    customSiteTitle: 'AI Proposal Writer API',
    customCss: `
      /* Import Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
      
      /* Reset and Base */
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #0a0a0a;
        color: #e5e5e5;
        margin: 0;
        padding: 0;
        line-height: 1.6;
        overflow-x: hidden;
      }
      
      /* Hide default elements */
      .swagger-ui .topbar,
      .swagger-ui .info .title small,
      .swagger-ui .info .title small a {
        display: none !important;
      }
      
      /* Custom Header */
      .swagger-ui::before {
        content: 'AI Proposal Writer API';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%);
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: #00d4aa;
        letter-spacing: 0.5px;
        z-index: 1000;
        box-shadow: 0 2px 20px rgba(0, 212, 170, 0.1);
      }
      
      /* Main container */
      .swagger-ui {
        padding-top: 80px;
        background: #0a0a0a;
        min-height: 100vh;
      }
      
      /* Info section */
      .swagger-ui .info {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border: 1px solid #333;
        border-radius: 12px;
        margin: 20px;
        padding: 30px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .swagger-ui .info::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d4aa, #0099cc, #00d4aa);
        background-size: 200% 100%;
        animation: shimmer 3s ease-in-out infinite;
      }
      
      .swagger-ui .info .title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 15px;
        text-align: center;
        letter-spacing: -0.5px;
      }
      
      .swagger-ui .info .description {
        font-size: 1rem;
        color: #b0b0b0;
        text-align: center;
        margin-bottom: 20px;
        line-height: 1.7;
      }
      
      /* Scheme container */
      .swagger-ui .scheme-container {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        margin: 20px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      
      /* Tags */
      .swagger-ui .opblock-tag {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        margin: 15px 20px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .swagger-ui .opblock-tag:hover {
        border-color: #00d4aa;
        box-shadow: 0 8px 30px rgba(0, 212, 170, 0.15);
        transform: translateY(-2px);
      }
      
      .swagger-ui .opblock-tag-section h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: #ffffff;
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .swagger-ui .opblock-tag-section h3::before {
        content: '⚡';
        font-size: 1.1rem;
        color: #00d4aa;
      }
      
      /* Operation blocks */
      .swagger-ui .opblock {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 6px;
        margin: 8px 0;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .swagger-ui .opblock:hover {
        border-color: #00d4aa;
        box-shadow: 0 4px 20px rgba(0, 212, 170, 0.1);
      }
      
      .swagger-ui .opblock.opblock-get {
        border-left: 4px solid #10b981;
      }
      
      .swagger-ui .opblock.opblock-post {
        border-left: 4px solid #3b82f6;
      }
      
      .swagger-ui .opblock.opblock-put {
        border-left: 4px solid #f59e0b;
      }
      
      .swagger-ui .opblock.opblock-delete {
        border-left: 4px solid #ef4444;
      }
      
      .swagger-ui .opblock.opblock-patch {
        border-left: 4px solid #8b5cf6;
      }
      
      /* Operation summary */
      .swagger-ui .opblock .opblock-summary {
        padding: 16px 20px;
        background: #2a2a2a;
        border-bottom: 1px solid #444;
      }
      
      .swagger-ui .opblock .opblock-summary-operation-id {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        font-weight: 500;
        color: #00d4aa;
        background: rgba(0, 212, 170, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid rgba(0, 212, 170, 0.2);
      }
      
      .swagger-ui .opblock .opblock-summary-path {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        font-weight: 500;
        color: #ffffff;
        margin-left: 10px;
      }
      
      .swagger-ui .opblock .opblock-summary-description {
        font-size: 0.9rem;
        color: #b0b0b0;
        margin-top: 8px;
        margin-left: 10px;
      }
      
      /* HTTP method badges */
      .swagger-ui .opblock .opblock-summary-method {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        font-size: 0.75rem;
        padding: 6px 12px;
        min-width: 60px;
        text-align: center;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary-method {
        background: #10b981;
        color: #ffffff;
      }
      
      .swagger-ui .opblock.opblock-post .opblock-summary-method {
        background: #3b82f6;
        color: #ffffff;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary-method {
        background: #f59e0b;
        color: #ffffff;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary-method {
        background: #ef4444;
        color: #ffffff;
      }
      
      .swagger-ui .opblock.opblock-patch .opblock-summary-method {
        background: #8b5cf6;
        color: #ffffff;
      }
      
      /* Buttons */
      .swagger-ui .try-out__btn {
        background: linear-gradient(135deg, #00d4aa, #0099cc);
        border: none;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
        padding: 8px 16px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 212, 170, 0.3);
      }
      
      .swagger-ui .try-out__btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0, 212, 170, 0.4);
      }
      
      .swagger-ui .execute-wrapper .btn.execute {
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 6px;
        color: #ffffff;
        font-weight: 500;
        padding: 10px 20px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
      }
      
      .swagger-ui .execute-wrapper .btn.execute:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      }
      
      /* Response section */
      .swagger-ui .responses-wrapper {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 6px;
        margin: 15px 0;
        padding: 20px;
      }
      
      .swagger-ui .responses-table {
        border: 1px solid #333;
        border-radius: 6px;
        overflow: hidden;
      }
      
      .swagger-ui .responses-table th {
        background: #2a2a2a;
        color: #ffffff;
        font-weight: 600;
        padding: 12px;
        border-bottom: 1px solid #333;
      }
      
      .swagger-ui .responses-table td {
        padding: 12px;
        border-bottom: 1px solid #333;
        color: #b0b0b0;
      }
      
      /* Code blocks */
      .swagger-ui .highlight-code {
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 6px;
        padding: 16px;
        margin: 10px 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
      }
      
      /* Models section */
      .swagger-ui .models {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        margin: 20px;
        padding: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      
      .swagger-ui .models h4 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .swagger-ui .models h4::before {
        content: '📋';
        font-size: 1rem;
        color: #00d4aa;
      }
      
      /* Input fields */
      .swagger-ui input[type="text"],
      .swagger-ui textarea,
      .swagger-ui select {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        color: #ffffff;
        padding: 8px 12px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
      }
      
      .swagger-ui input[type="text"]:focus,
      .swagger-ui textarea:focus,
      .swagger-ui select:focus {
        outline: none;
        border-color: #00d4aa;
        box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
      }
      
      /* Animations */
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Apply animations */
      .swagger-ui .info,
      .swagger-ui .scheme-container,
      .swagger-ui .opblock-tag,
      .swagger-ui .models {
        animation: fadeInUp 0.6s ease-out;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #1a1a1a;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #00d4aa;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .swagger-ui .info {
          margin: 10px;
          padding: 20px;
        }
        
        .swagger-ui .info .title {
          font-size: 1.8rem;
        }
        
        .swagger-ui .opblock-tag {
          margin: 10px;
          padding: 15px;
        }
      }
    `,
    explorer: true,
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    },
    ...swaggerCustomOptions,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap(); 