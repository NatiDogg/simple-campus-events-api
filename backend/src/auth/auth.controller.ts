import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './strategies/jwt.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created (safe fields only).' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive access + refresh tokens' })
  @ApiResponse({ status: 200, description: 'Token pair returned.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a refresh token for a new token pair' })
  @ApiResponse({ status: 200, description: 'New token pair.' })
  @ApiResponse({ status: 401, description: 'Invalid, expired or already-used refresh token.' })
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current authenticated user' })
  @ApiResponse({ status: 200, description: 'The user from the access token.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  me(@Req() req: Request) {
    return req.user as AuthUser;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out (clears the stored refresh-token hash)' })
  @ApiResponse({ status: 200, description: 'Logged out.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  logout(@Req() req: Request) {
    return this.auth.logout((req.user as AuthUser).id);
  }
}