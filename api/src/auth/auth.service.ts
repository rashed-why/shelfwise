import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { toPublicUser, User } from '../types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /** Called after LocalStrategy validates email/password. Issues access + refresh tokens. */
  async login(user: User) {
    return this.issueTokens(user);
  }

  /**
   * Validates the refresh token, rotates it (delete old → issue new pair),
   * and returns fresh access + refresh tokens.
   */
  async refresh(refreshToken: string) {
    // Look up by hash — we never store the plain token in the DB
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      // Clean up expired tokens so they can't be reused
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }

      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotation: invalidate the used token before issuing a new one
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(toPublicUser(stored.user));
  }

  /**
   * Revokes refresh token(s). With refreshToken — deletes that session only.
   * Without — deletes all refresh tokens for the user (client logout via JWT).
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const stored = await this.prisma.refreshToken.findUnique({
        where: { tokenHash: this.hashToken(refreshToken) },
      });

      if (!stored || stored.userId !== userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    return { message: 'Logged out successfully' };
  }

  /** Shared by login and refresh — always creates a new token pair. */
  private async issueTokens(user: User) {
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /** Expiry comes from JWT_EXPIRES_IN in auth.module.ts (default: 1h). */
  private async generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }

  /**
   * Generates a random opaque token, stores its SHA-256 hash in the DB,
   * and returns the plain token to the client. Called on both login and refresh.
   */
  private async createRefreshToken(user: Pick<User, 'id' | 'email'>) {
    const refreshToken = randomBytes(64).toString('hex');
    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(refreshToken),
        userId: user.id,
        email: user.email,
        expiresAt: this.getExpiryDate(expiresIn),
      },
    });

    return refreshToken;
  }

  /** SHA-256 is sufficient for high-entropy random tokens (unlike passwords, which use bcrypt). */
  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  /** Parses env values like "7d", "1h", "30m" into a Date. */
  private getExpiryDate(expiresIn: string) {
    const units = { d: 86_400_000, h: 3_600_000, m: 60_000, s: 1_000 };
    const [, n = '7', u = 'd'] = expiresIn.match(/^(\d+)([dhms])$/) ?? [];

    return new Date(Date.now() + Number(n) * units[u as keyof typeof units]);
  }
}
