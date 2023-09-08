export function getEnvHost() {
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_PUBLIC_URL ||
    'http://localhost:3000'
  );
}
