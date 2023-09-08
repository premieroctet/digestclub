import { routes } from '@/core/constants';
import { EMAIL_SUBJECTS, sendEmail } from '@/emails';
import LoginEmail from '@/emails/templates/LoginEmail';
import prisma from '@/lib/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        await sendEmail({
          to: email,
          subject: EMAIL_SUBJECTS.LOGIN,
          component: <LoginEmail url={url} />,
        });
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (user) {
        session.user.id = user.id;

        if (user.role) {
          session.user.role = user.role;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: routes.LOGIN,
  },
};

export default NextAuth(authOptions);
