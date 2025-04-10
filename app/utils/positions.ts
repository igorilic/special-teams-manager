import { PositionInfo, TeamDepthOption, TeamType } from "../types";

// Special teams constants
export const TEAMS = {
  KICKOFF: "Kickoff",
  KICKOFF_RETURN: "Kickoff Return",
  PUNT: "Punt",
  FIELD_GOAL: "Field Goal",
  HANDS: "Hands",
} as const;

// Position constants for each special team
export const POSITIONS: Record<TeamType, PositionInfo[]> = {
  // Kickoff team positions
  KICKOFF: [
    { id: "L1", name: "L1 (Safety)" },
    { id: "L2", name: "L2 (Contain)" },
    { id: "L3", name: "L3 (Line)" },
    { id: "L4", name: "L4 (Line)" },
    { id: "L5", name: "L5 (Gunner)" },
    { id: "K", name: "K (Kicker)" },
    { id: "R5", name: "R5 (Gunner)" },
    { id: "R4", name: "R4 (Line)" },
    { id: "R3", name: "R3 (Line)" },
    { id: "R2", name: "R2 (Contain)" },
    { id: "R1", name: "R1 (Safety)" },
  ],

  // Kickoff Return team positions
  KICKOFF_RETURN: [
    { id: "LT", name: "LT (Left Tackle)" },
    { id: "LG", name: "LG (Left Guard)" },
    { id: "LC", name: "LC (Left Center)" },
    { id: "RC", name: "RC (Right Center)" },
    { id: "RG", name: "RG (Right Guard)" },
    { id: "RT", name: "RT (Right Tackle)" },
    { id: "LW", name: "LW (Left Wing)" },
    { id: "FB", name: "FB (Fullback)" },
    { id: "RW", name: "RW (Right Wing)" },
    { id: "LR", name: "LR (Left Returner)" },
    { id: "RR", name: "RR (Right Returner)" },
  ],

  // Punt team positions
  PUNT: [
    { id: "GL", name: "GL (Gunner Left)" },
    { id: "LW", name: "LW (Left Wing)" },
    { id: "LT", name: "LT (Left Tackle)" },
    { id: "LG", name: "LG (Left Guard)" },
    { id: "LS", name: "LS (Long Snapper)" },
    { id: "RG", name: "RG (Right Guard)" },
    { id: "RT", name: "RT (Right Tackle)" },
    { id: "RW", name: "RW (Right Wing)" },
    { id: "GR", name: "GR (Gunner Right)" },
    { id: "PP", name: "PP (Punt Protector)" },
    { id: "P", name: "P (Punter)" },
  ],

  // Field Goal/PAT team positions
  FIELD_GOAL: [
    { id: "LW", name: "LW (Left Wing)" },
    { id: "LTE", name: "LTE (Left Tight End)" },
    { id: "LT", name: "LT (Left Tackle)" },
    { id: "LG", name: "LG (Left Guard)" },
    { id: "LS", name: "LS (Long Snapper)" },
    { id: "RG", name: "RG (Right Guard)" },
    { id: "RT", name: "RT (Right Tackle)" },
    { id: "RTE", name: "RTE (Right Tight End)" },
    { id: "RW", name: "RW (Right Wing)" },
    { id: "H", name: "H (Holder)" },
    { id: "K", name: "K (Kicker)" },
  ],

  // Hands team positions (onside kick recovery)
  HANDS: [
    { id: "FL", name: "FL (Front Left)" },
    { id: "FC", name: "FC (Front Center)" },
    { id: "FR", name: "FR (Front Right)" },
    { id: "ML", name: "ML (Middle Left)" },
    { id: "MC", name: "MC (Middle Center)" },
    { id: "MR", name: "MR (Middle Right)" },
    { id: "BL", name: "BL (Back Left)" },
    { id: "BC", name: "BC (Back Center)" },
    { id: "BR", name: "BR (Back Right)" },
    { id: "SL", name: "SL (Safety Left)" },
    { id: "SR", name: "SR (Safety Right)" },
  ],
};

// Maps team types to their Prisma model names
export const TEAM_MODEL_MAP: Record<string, string> = {
  [TEAMS.KICKOFF]: "kickoffDepth",
  [TEAMS.KICKOFF_RETURN]: "kickoffReturnDepth",
  [TEAMS.PUNT]: "puntDepth",
  [TEAMS.FIELD_GOAL]: "fieldGoalDepth",
  [TEAMS.HANDS]: "handsDepth",
};

// Team depth labels
export const TEAM_DEPTH: TeamDepthOption[] = [
  { value: 1, label: "1st Team" },
  { value: 2, label: "2nd Team" },
  { value: 3, label: "3rd Team" },
];

// Common football positions for primary position dropdown
export const FOOTBALL_POSITIONS: string[] = [
  "QB",
  "RB",
  "FB",
  "WR",
  "TE",
  "LT",
  "LG",
  "C",
  "RG",
  "RT",
  "DE",
  "DT",
  "NT",
  "OLB",
  "ILB",
  "MLB",
  "CB",
  "FS",
  "SS",
  "DB",
  "K",
  "P",
  "LS",
  "KR",
  "PR",
];

// Get team type from name
export function getTeamTypeFromName(teamName: string): TeamType | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(TEAMS).find(([_, value]) => value === teamName);
  return entry ? (entry[0] as TeamType) : undefined;
}

// Get positions for a team
export function getPositionsForTeam(teamType: TeamType): PositionInfo[] {
  return POSITIONS[teamType] || [];
}

// Function to sort positions in their correct order
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortPositions(positions: any[], teamType: TeamType): any[] {
  const positionOrder = POSITIONS[teamType].map((p) => p.id);

  return [...positions].sort((a, b) => {
    const posA = positionOrder.indexOf(a.position);
    const posB = positionOrder.indexOf(b.position);
    return posA - posB;
  });
}
