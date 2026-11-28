import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  refreshHash: string | null;
}

export type SafeUser = Pick<User, 'id' | 'email' | 'roles'>;

export const toSafeUser = (u: User): SafeUser => ({
  id: u.id,
  email: u.email,
  roles: u.roles,
});

@Injectable()
export class UsersService {
  private users: User[] = [];

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email.toLowerCase());
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  create(email: string, passwordHash: string): User {
    const user: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      roles: ['user'],
      refreshHash: null,
    };
    this.users.push(user);
    return user;
  }

  setRefreshHash(id: string, refreshHash: string | null): void {
    const user = this.findById(id);
    if (user) user.refreshHash = refreshHash;
  }
}