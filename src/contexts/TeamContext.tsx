'use client';

import { Team } from '@prisma/client';
import React, { createContext, ReactNode, useContext } from 'react';

type TeamProviderProps = {
  children: ReactNode;
  team: Team;
};

const TeamContext = createContext<Team>({} as Team);

export const TeamProvider = ({ children, team }: TeamProviderProps) => {
  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
};

export const useTeam = () => {
  const teamContext = useContext(TeamContext);

  return teamContext;
};
