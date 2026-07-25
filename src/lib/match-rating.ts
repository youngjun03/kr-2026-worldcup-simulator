import { FORMATION_SLOTS } from "@/data/formations";
import { PLAYER_BY_ID } from "@/data/players";
import { getPositionFit } from "@/lib/lineup";

import type {
  Formation,
  Lineup,
  PlayerPosition,
  PlayerStats,
} from "@/types/game";
import type {
  CalculatedMatchMetrics,
  MatchMetrics,
} from "@/types/match";

type AdjustedPlayer = {
  role: PlayerPosition;
  stats: PlayerStats;
};

const STAT_KEYS: (keyof PlayerStats)[] = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "stamina",
];

const EMPTY_STATS: PlayerStats = {
  pace: 0,
  shooting: 0,
  passing: 0,
  dribbling: 0,
  defending: 0,
  stamina: 0,
};

const EMPTY_METRICS: MatchMetrics = {
  attack: 0,
  midfield: 0,
  defense: 0,
  pressing: 0,
  transition: 0,
  chanceCreation: 0,
  goalkeeping: 0,
  overall: 0,
};

const ATTACK_ROLES = new Set<PlayerPosition>([
  "ST",
  "LW",
  "RW",
  "AM",
]);

const MIDFIELD_ROLES = new Set<PlayerPosition>([
  "DM",
  "CM",
  "AM",
]);

const DEFENSE_ROLES = new Set<PlayerPosition>([
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "DM",
]);

/**
 * 현재 선발을 경기 시뮬레이션용 팀 지표로 변환합니다.
 *
 * 포지션 적합도에 따라 각 선수의 능력치를 먼저 보정한 뒤,
 * 공격수·미드필더·수비수 역할에 맞춰 지표를 계산합니다.
 */
export function calculateMatchMetrics(
  formation: Formation,
  lineup: Lineup,
): CalculatedMatchMetrics {
  const slots = FORMATION_SLOTS[formation];

  const adjustedPlayers: AdjustedPlayer[] = [];

  for (const slot of slots) {
    const playerId = lineup[slot.id];

    if (!playerId) {
      continue;
    }

    const player = PLAYER_BY_ID[playerId];

    if (!player) {
      continue;
    }

    const fit = getPositionFit(
      player.positions,
      slot.role,
    );

    const adjustedStats = Object.fromEntries(
      STAT_KEYS.map((statKey) => [
        statKey,
        player.stats[statKey] * fit.multiplier,
      ]),
    ) as PlayerStats;

    adjustedPlayers.push({
      role: slot.role,
      stats: adjustedStats,
    });
  }

  const selectedCount = adjustedPlayers.length;

  if (selectedCount === 0) {
    return {
      ...EMPTY_METRICS,
      selectedCount: 0,
      isComplete: false,
    };
  }

  const outfieldPlayers = adjustedPlayers.filter(
    (player) => player.role !== "GK",
  );

  const goalkeeperPlayers = adjustedPlayers.filter(
    (player) => player.role === "GK",
  );

  const allAverage = averagePlayerStats(
    outfieldPlayers.length > 0
      ? outfieldPlayers
      : adjustedPlayers,
    EMPTY_STATS,
  );

  const attackerAverage = averagePlayerStats(
    adjustedPlayers.filter((player) =>
      ATTACK_ROLES.has(player.role),
    ),
    allAverage,
  );

  const midfielderAverage = averagePlayerStats(
    adjustedPlayers.filter((player) =>
      MIDFIELD_ROLES.has(player.role),
    ),
    allAverage,
  );

  const defenderAverage = averagePlayerStats(
    adjustedPlayers.filter((player) =>
      DEFENSE_ROLES.has(player.role),
    ),
    allAverage,
  );

  const goalkeeperAverage = averagePlayerStats(
    goalkeeperPlayers,
    EMPTY_STATS,
  );

  /*
   * 공격력:
   * 득점과 직접 관련된 슈팅을 가장 크게 반영하고,
   * 드리블·속도·패스를 함께 사용합니다.
   */
  const attack = weightedAverage([
    [attackerAverage.shooting, 0.4],
    [attackerAverage.dribbling, 0.25],
    [attackerAverage.pace, 0.2],
    [attackerAverage.passing, 0.15],
  ]);

  /*
   * 중원:
   * 패스와 드리블을 중심으로 체력과 수비 능력을 반영합니다.
   */
  const midfield = weightedAverage([
    [midfielderAverage.passing, 0.4],
    [midfielderAverage.dribbling, 0.25],
    [midfielderAverage.stamina, 0.2],
    [midfielderAverage.defending, 0.15],
  ]);

  /*
   * 수비력:
   * 수비 능력을 가장 크게 사용하며,
   * 체력·속도·후방 패스 능력도 반영합니다.
   */
  const defense = weightedAverage([
    [defenderAverage.defending, 0.5],
    [defenderAverage.stamina, 0.25],
    [defenderAverage.pace, 0.15],
    [defenderAverage.passing, 0.1],
  ]);

  /*
   * 압박:
   * 지속적인 활동을 위한 체력과 수비 능력을 중심으로 계산합니다.
   */
  const pressing = weightedAverage([
    [allAverage.stamina, 0.45],
    [allAverage.defending, 0.3],
    [allAverage.pace, 0.15],
    [allAverage.dribbling, 0.1],
  ]);

  /*
   * 공격 전환:
   * 공을 빼앗은 후 얼마나 빠르고 정확하게
   * 전진할 수 있는지를 나타냅니다.
   */
  const transition = weightedAverage([
    [allAverage.pace, 0.35],
    [allAverage.passing, 0.25],
    [allAverage.dribbling, 0.25],
    [allAverage.stamina, 0.15],
  ]);

  /*
   * 기회 창출:
   * 결정적인 패스와 개인 돌파를 중심으로 계산합니다.
   */
  const chanceCreation = weightedAverage([
    [attackerAverage.passing, 0.4],
    [attackerAverage.dribbling, 0.3],
    [attackerAverage.pace, 0.15],
    [attackerAverage.shooting, 0.15],
  ]);

  /*
   * 현재 선수 데이터가 FC의 필드 능력치 6개뿐이므로,
   * 골키퍼 수치는 임시로 수비와 체력을 사용합니다.
   *
   * 나중에 골키퍼 전용 능력치를 추가할 때
   * 이 부분만 교체하면 됩니다.
   */
  const goalkeeping =
    goalkeeperPlayers.length > 0
      ? weightedAverage([
          [goalkeeperAverage.defending, 0.75],
          [goalkeeperAverage.stamina, 0.25],
        ])
      : 0;

  const overall = weightedAverage([
    [attack, 0.2],
    [midfield, 0.2],
    [defense, 0.2],
    [pressing, 0.1],
    [transition, 0.1],
    [chanceCreation, 0.12],
    [goalkeeping, 0.08],
  ]);

  return {
    attack,
    midfield,
    defense,
    pressing,
    transition,
    chanceCreation,
    goalkeeping,
    overall,
    selectedCount,
    isComplete: selectedCount === 11,
  };
}

function averagePlayerStats(
  players: AdjustedPlayer[],
  fallback: PlayerStats,
): PlayerStats {
  if (players.length === 0) {
    return { ...fallback };
  }

  const totals: PlayerStats = {
    ...EMPTY_STATS,
  };

  for (const player of players) {
    for (const statKey of STAT_KEYS) {
      totals[statKey] += player.stats[statKey];
    }
  }

  return Object.fromEntries(
    STAT_KEYS.map((statKey) => [
      statKey,
      totals[statKey] / players.length,
    ]),
  ) as PlayerStats;
}

function weightedAverage(
  values: Array<[number, number]>,
): number {
  const result = values.reduce(
    (sum, [value, weight]) =>
      sum + value * weight,
    0,
  );

  return clampRating(Math.round(result));
}

function clampRating(value: number): number {
  return Math.max(0, Math.min(100, value));
}