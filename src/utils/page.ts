import { TEAM_SETTINGS_ITEMS, TeamSettingsItemsId } from '@/core/constants';

export function getTeamSettingsPageInfo(
  id: TeamSettingsItemsId,
  teamSlug: string
) {
  const pageInfo = TEAM_SETTINGS_ITEMS.find((item) => item.id === id);
  if (!pageInfo) {
    throw new Error(
      `Page with id ${id} not implemented (see core/constants.tsx)`
    );
  }
  const { title, subtitle, routePath } = pageInfo;
  const menuItems = TEAM_SETTINGS_ITEMS.map((item) => ({
    ...item,
    href: item.routePath.replace(':slug', teamSlug),
    isActive: item.id === 'templates',
  }));
  return {
    title,
    subtitle,
    routePath: routePath.replace(':slug', teamSlug),
    menuItems,
  };
}
