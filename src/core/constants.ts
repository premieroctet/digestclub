export const routes = {
  HOME: '/',
  LOGIN: '/auth/login',
  ACCOUNT: '/account',
  TEAMS: '/teams',
  TEAM: '/teams/:slug',
  TEAMS_CREATE: '/teams/create',
  TEAMS_EDIT: '/teams/:slug/settings',
  DIGEST: '/teams/:slug/digests/:id',
  DIGEST_EDIT: '/teams/:slug/digests/:id/edit',
  UPDATES: '/updates',
  DISCOVER: '/discover',
};

export const mainNavigation = [
  {
    route: routes.HOME,
    label: 'Home',
    requireAuth: false,
  },
  {
    route: routes.TEAMS,
    label: 'Dashboard',
    requireAuth: true,
  },
  {
    route: routes.DISCOVER,
    label: 'Discover',
    requireAuth: false,
  },
  {
    route: routes.UPDATES,
    label: 'Updates',
    requireAuth: false,
  },
] as const;

export type Route = keyof typeof routes;

export enum AvailableRoles {
  PUBLISHER = 'publisher',
  ADMIN = 'admin',
}

export enum UserRoles {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  PUBLISHER = 'PUBLISHER',
}

export const PUBLIC_ROUTES = ['/', routes.LOGIN];

export const COOKIES = {
  DEFAULT_TEAM: '__digestclub_default_team',
};
