import { GlobalRole } from '@prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { id: string; role: GlobalRole };
  }

  interface User extends DefaultUser {
    role: GlobalRole;
  }
}
