import { FORMATION_SLOTS } from "@/data/formations";
import { PLAYER_BY_ID } from "@/data/players";
import { getPositionFit } from "@/lib/lineup";

import type {
  Formation,
  Lineup,
  PlayerStats,
  TeamRating,
} from "@/types/game";

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

/**
 * 현재 포메이션과 선발 명단을 기준으로
 * 보정된 팀 능력치를 계산합니다.
 */
export function calculateTeamRating(
  formation: Formation,
  lineup: Lineup,
): TeamRating {
  const slots = FORMATION_SLOTS[formation];
  const totalStats: PlayerStats = {
    ...EMPTY_STATS,
  };

  let selectedCount = 0;

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

    selectedCount += 1;

    for (const statKey of STAT_KEYS) {
      /*
       * 적합: 원래 능력치 × 1
       * 가능: 원래 능력치 × 0.97
       * 부적합: 원래 능력치 × 0.9
       */
      totalStats[statKey] +=
        player.stats[statKey] * fit.multiplier;
    }
  }

  if (selectedCount === 0) {
    return {
      ...EMPTY_STATS,
      overall: 0,
      selectedCount: 0,
      isComplete: false,
    };
  }

  const averageStats = Object.fromEntries(
    STAT_KEYS.map((statKey) => [
      statKey,
      Math.round(
        totalStats[statKey] / selectedCount,
      ),
    ]),
  ) as PlayerStats;

  const overall = Math.round(
    STAT_KEYS.reduce(
      (sum, statKey) =>
        sum + averageStats[statKey],
      0,
    ) / STAT_KEYS.length,
  );

  return {
    ...averageStats,
    overall,
    selectedCount,
    isComplete: selectedCount === 11,
  };
}