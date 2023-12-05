'use client';

import { routes } from '@/core/constants';
import { Team } from '@prisma/client';
import { HiChevronDown } from '@react-icons/all-files/hi/HiChevronDown';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { usePathname } from 'next/navigation';
import BookmarkButton from '../../bookmark/BookmarkButton';
import { signOut } from 'next-auth/react';
import Divider from './Divider';
import Item from './Item';
import {
  AdjustmentsVerticalIcon,
  CheckIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';

type Props = {
  teams?: Team[];
};

export const NavMenu = ({ teams }: Props) => {
  const pathName = usePathname();
  const currentTeamSlug = pathName?.split('/')[2];
  const currentTeam = teams?.find((team) => team.slug === currentTeamSlug);

  function onSignOut() {
    signOut({ callbackUrl: '/' });
  }

  return (
    <div className="relative flex items-stretch">
      <div className="flex flex-row gap-4 items-center relative">
        <div>
          {currentTeam && pathName !== '/' && (
            <>
              <BookmarkButton team={currentTeam} />
            </>
          )}
        </div>
        <NavigationMenu.Root className="h-full content-s flex items-stretch">
          <NavigationMenu.List className="flex items-stretch h-full">
            <NavigationMenu.Item asChild>
              <div className="flex items-stretch">
                <NavigationMenu.Trigger
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                  className="group px-2 flex flex-row gap-2 items-center hover:text-violet-600 data-[state=open]:text-violet-600 focus:text-violet-600"
                >
                  <span className="text-sm 2xl:text-base">
                    {currentTeam ? currentTeam.name : 'Teams'}
                  </span>
                  <span className="group-data-[state=closed]:-rotate-180 -rotate-0 transition-all duration-200">
                    <HiChevronDown />
                  </span>
                </NavigationMenu.Trigger>

                <NavigationMenu.Content
                  onPointerEnter={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                  className="absolute right-0 :right-auto left-auto lg:left-[-100%] xl:left-[0] top-[150%] w-fit md:w-fit z-10 animate-in fade-in duration-300"
                >
                  <div className="w-auto min-w-[150px] sm:min-w-[224px] flex-auto overflow-hidden rounded-md bg-white text-sm 2xl:text-base leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <div className="py-2">
                      {teams &&
                        teams.length > 0 &&
                        teams?.map((team) => (
                          <Item
                            icon={
                              currentTeam?.id === team.id ? (
                                <CheckIcon />
                              ) : (
                                <></>
                              )
                            }
                            key={team.id}
                            href={`${routes.TEAMS}/${team.slug}`}
                          >
                            {team.name}
                          </Item>
                        ))}
                      {teams && teams.length > 0 && <Divider />}
                      {!!currentTeam && (
                        <Item
                          href={routes.TEAM_EDIT_PROFILE.replace(
                            ':slug',
                            currentTeam!.slug
                          )}
                          icon={<AdjustmentsVerticalIcon />}
                        >
                          Team settings
                        </Item>
                      )}
                      <Item href={routes.TEAMS_CREATE} icon={<PlusIcon />}>
                        Create new team
                      </Item>
                      <Item href={routes.ACCOUNT} icon={<UserIcon />}>
                        My Account
                      </Item>
                      <Divider />
                      <Item
                        onClick={onSignOut}
                        icon={<ArrowLeftOnRectangleIcon />}
                      >
                        Logout
                      </Item>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </div>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </div>
  );
};
