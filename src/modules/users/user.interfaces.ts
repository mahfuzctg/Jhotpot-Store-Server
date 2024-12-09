import { UserRole } from '@prisma/client';

export type IAuthUser = {
  email: string;
  role: UserRole;
  id: string;
} | null;