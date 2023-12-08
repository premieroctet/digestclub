import {
  IdentificationIcon,
  KeyIcon,
  UserIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';

export const routes = {
  HOME: '/',
  LOGIN: '/auth/login',
  ACCOUNT: '/account',
  TEAMS: '/teams',
  TEAMS_PUBLIC: '/:slug',
  TEAM: '/teams/:slug',
  TEAMS_CREATE: '/teams/create',
  TEAMS_EDIT: '/teams/:slug/settings',
  TEAM_EDIT_PROFILE: '/teams/:slug/settings/informations',
  TEAM_EDIT_MEMBERS: '/teams/:slug/settings/members',
  TEAM_EDIT_TEMPLATES: '/teams/:slug/settings/templates',
  TEAM_EDIT_INTEGRATIONS: '/teams/:slug/settings/integrations',
  DIGEST: '/teams/:slug/digests/:id',
  DIGEST_EDIT: '/teams/:slug/digests/:id/edit',
  UPDATES: '/updates',
  DISCOVER: '/discover',
  TAG: '/tags/:slug',
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

export const TEAM_SETTINGS_ITEMS = [
  {
    id: 'profile',
    title: 'Profile',
    routePath: routes.TEAM_EDIT_PROFILE,
    icon: <IdentificationIcon className="h-7 w-7" />,
    subtitle:
      'Fill your team informations, they will be displayed on your public team page',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    routePath: routes.TEAM_EDIT_INTEGRATIONS,
    icon: <KeyIcon className="h-7 w-7" />,
    subtitle: 'Increase your digest reach by integrating with other tools.',
  },
  {
    id: 'members',
    title: 'Members',
    routePath: routes.TEAM_EDIT_MEMBERS,
    icon: <UserIcon className="h-7 w-7" />,
    subtitle:
      'Manage your team members, invitations and newsletter subscriptions',
  },
  {
    id: 'templates',
    title: 'Templates',
    routePath: routes.TEAM_EDIT_TEMPLATES,
    icon: <ViewColumnsIcon className="h-7 w-7" />,
    subtitle: 'Manage your team templates',
  },
];

export type TeamSettingsItemsId = (typeof TEAM_SETTINGS_ITEMS)[number]['id'];

export const COOKIES = {
  DEFAULT_TEAM: '__digestclub_default_team',
};
