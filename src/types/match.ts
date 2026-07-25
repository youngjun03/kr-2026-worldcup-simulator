import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
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

/**
 * 경기 시뮬레이션에서 사용하는 팀 단위 지표입니다.
 *
 * 선수 데이터에 있는 속도·슈팅·패스·드리블·수비·체력을
 * 경기 계산에 더 편한 형태로 변환한 값입니다.
 */
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

export type OpponentProfile = {
  id: string;
  name: string;
  flag: string;

  metrics: MatchMetrics;

  tactics: {
    attackStyle: AttackStyle;
    defenseStyle: DefenseStyle;
    defensiveLine: DefensiveLine;
  };

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