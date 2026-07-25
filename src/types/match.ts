import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
  Formation,
  Lineup,
} from "@/types/game";

export type TeamSide = "korea" | "opponent";

export type MatchEventType =
  | "build_up"
  | "dangerous_attack"
  | "shot"
  | "save"
  | "goal";

export type AttackPattern =
  | "counter_attack"
  | "central_attack"
  | "wing_attack"
  | "possession_attack"
  | "set_piece";

export type ShotOutcome =
  | "blocked"
  | "off_target"
  | "saved"
  | "goal";

export type MatchMetrics = {
  attack: number;
  midfield: number;
  defense: number;
  pressing: number;
  transition: number;
  chanceCreation: number;
  goalkeeping: number;
  overall: number;
};

export type CalculatedMatchMetrics = MatchMetrics & {
  selectedCount: number;
  isComplete: boolean;
};

export type TeamTactics = {
  attackStyle: AttackStyle;
  defenseStyle: DefenseStyle;
  defensiveLine: DefensiveLine;
};

export type OpponentProfile = {
  id: string;
  name: string;
  flag: string;

  metrics: MatchMetrics;
  tactics: TeamTactics;

  strengths: string[];
  weaknesses: string[];
};

export type MatchEvent = {
  id: string;
  minute: number;

  type: MatchEventType;
  team: TeamSide;
  pattern?: AttackPattern;

  creatorPlayerId?: string;
  shooterPlayerId?: string;
  defenderPlayerId?: string;

  outcome?: ShotOutcome;

  homeScore: number;
  awayScore: number;

  reasons: string[];
};

export type MatchState = {
  currentMinute: number;
  homeScore: number;
  awayScore: number;
  eventIndex: number;
};

export type SimulateSegmentInput = {
  seed: number;

  segmentStart: number;
  segmentEnd: number;

  state: MatchState;

  formation: Formation;
  lineup: Lineup;
  tactics: TeamTactics;

  opponent: OpponentProfile;
};

export type SegmentSimulationResult = {
  state: MatchState;
  events: MatchEvent[];
};