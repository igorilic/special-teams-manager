import {
  Player,
  KickoffDepth,
  KickoffReturnDepth,
  PuntDepth,
  FieldGoalDepth,
  HandsDepth,
} from "@prisma/client";

export type PlayerWithPositions = Player & {
  kickoffPositions?: KickoffDepth[];
  kickoffReturnPositions?: KickoffReturnDepth[];
  puntPositions?: PuntDepth[];
  fieldGoalPositions?: FieldGoalDepth[];
  handsPositions?: HandsDepth[];
};

export type TeamType =
  | "KICKOFF"
  | "KICKOFF_RETURN"
  | "PUNT"
  | "FIELD_GOAL"
  | "HANDS";

export type PositionInfo = {
  id: string;
  name: string;
};

export type TeamDepthOption = {
  value: number;
  label: string;
};

export type DepthChartPositionType = {
  id: string;
  position: string;
  teamDepth: number;
  playerId: number;
  playerName?: string;
  primaryPosition?: string;
};

export type PlayerFormData = {
  firstName: string;
  lastName: string;
  primaryPosition?: string;
  fgPosition?: string;
  koPosition?: string;
  korPosition?: string;
  puntPosition?: string;
  handsTeam: boolean;
  height?: string;
  weight?: number;
  fortyTime?: number;
};
