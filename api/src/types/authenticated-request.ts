import type { Request as ExpressRequest } from 'express';
import type { User } from './user';

export type AuthenticatedRequest = ExpressRequest & {
  user: User;
};
