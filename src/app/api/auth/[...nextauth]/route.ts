import NextAuth from 'next-auth';
import options from './options';

export const handler = NextAuth(options);

export {
  handler as DELETE,
  handler as GET,
  handler as OPTION,
  handler as POST,
  handler as PUT,
};
