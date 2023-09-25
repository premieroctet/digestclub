import { getEnvHost } from '@/lib/server';

export function generateTeamOGUrl(teamSlug: string) {
  return encodeURI(`${getEnvHost()}/api/team-og?team=${teamSlug}`);
}

export function generateDigestOGUrl(digestSlug: string) {
  return encodeURI(`${getEnvHost()}/api/digest-og?digest=${digestSlug}`);
}
