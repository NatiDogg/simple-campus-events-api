import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const expected = process.env.CLASSROOM_API_KEY;

   s
    if (!expected || apiKey !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}