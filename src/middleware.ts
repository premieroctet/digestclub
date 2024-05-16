import redirectionioMiddleware from '@redirection.io/vercel-middleware';

export default redirectionioMiddleware;

export const config = {
  unstable_allowDynamic: [
    '/node_modules/@redirection.io/**',
  ],
}
