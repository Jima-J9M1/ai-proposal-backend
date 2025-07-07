import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.originalUrl.startsWith('/api/v1/payments/webhook')) {
      req.rawBody = '';
      req.setEncoding('utf8');
      req.on('data', (chunk) => {
        req.rawBody += chunk;
      });
      req.on('end', () => {
        next();
      });
    } else {
      next();
    }
  }
} 