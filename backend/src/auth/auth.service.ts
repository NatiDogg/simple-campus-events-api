import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { SafeUser, User, UsersService, toSafeUser } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessPayload } from './strategies/jwt.strategy';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const ALGORITHM = 'HS256' as const;

@Injectable()
export class AuthService {

  private dummyHash: Promise<string>;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.dummyHash = argon2.hash('dummy-password-for-timing');
  }

  async register(dto: RegisterDto): Promise<SafeUser> {
    if (this.users.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await argon2.hash(dto.password);
    return toSafeUser(this.users.create(dto.email, passwordHash));
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = this.users.findByEmail(dto.email);
    const hash = user ? user.passwordHash : await this.dummyHash;
    const ok = await argon2.verify(hash, dto.password);
    if (!user || !ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let userId: string;
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        algorithms: [ALGORITHM],
      });
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = this.users.findById(userId);
    if (!user || !user.refreshHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const matches = await argon2.verify(user.refreshHash, refreshToken);
    if (!matches) {
   
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.issueTokens(user); 
  }

  logout(userId: string): { message: string } {
    this.users.setRefreshHash(userId, null);
    return { message: 'Logged out' };
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const accessPayload: AccessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const accessToken = await this.jwt.signAsync(accessPayload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
      algorithm: ALGORITHM,
    });
  
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti: randomUUID() },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
        algorithm: ALGORITHM,
      },
    );
    this.users.setRefreshHash(user.id, await argon2.hash(refreshToken));
    return { accessToken, refreshToken };
  }
}