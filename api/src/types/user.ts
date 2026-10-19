import { User as PrismaUser } from '../generated/prisma/client';

export type User = Omit<PrismaUser, 'password'>;

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  googleId: true,
  profileImage: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function toPublicUser(user: PrismaUser): User {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}
