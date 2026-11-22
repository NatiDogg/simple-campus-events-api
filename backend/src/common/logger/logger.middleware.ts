import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const time = new Date().toLocaleTimeString('en-GB');
    console.log(`[${time}] ${req.method} ${req.originalUrl}`);
    next(); 
  }
}
