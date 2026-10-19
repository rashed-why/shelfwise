import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { publicUserSelect, toPublicUser, User } from '../types/user';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const password = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password,
      },
      select: publicUserSelect,
    });

    return {
      message: 'User created successfully',
      user,
    };
  }

  async getUser(email: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  async findOrCreateFromGoogle(profile: {
    id: string;
    displayName?: string;
    emails?: Array<{ value: string }>;
  }): Promise<User> {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const name = profile.displayName ?? email.split('@')[0];

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, { email }],
      },
    });

    if (user) {
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id },
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          googleId: profile.id,
        },
      });
    }

    return toPublicUser(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.getUser(email);

      if (!user.password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return toPublicUser(user);
    } catch {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: publicUserSelect,
    });
  }
}
