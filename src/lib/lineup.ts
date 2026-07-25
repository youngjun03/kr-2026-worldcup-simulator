import { FORMATION_SLOTS } from "@/data/formations";
import { PLAYER_BY_ID } from "@/data/players";

import type {
  Formation,
  FormationSlot,
  Lineup,
  PlayerPosition,
} from "@/types/game";

const POSITION_COMPATIBILITY: Record<
  PlayerPosition,
  Partial<Record<PlayerPosition, number>>
> = {
  GK: {
    GK: 100,
  },

  CB: {
    CB: 100,
    DM: 72,
    LB: 58,
    RB: 58,
  },

  LB: {
    LB: 100,
    LWB: 92,
    CB: 65,
  },

  RB: {
    RB: 100,
    RWB: 92,
    CB: 65,
  },

  LWB: {
    LWB: 100,
    LB: 92,
    LW: 62,
  },

  RWB: {
    RWB: 100,
    RB: 92,
    RW: 62,
  },

  DM: {
    DM: 100,
    CM: 85,
    CB: 75,
  },

  CM: {
    CM: 100,
    DM: 86,
    AM: 78,
  },

  AM: {
    AM: 100,
    CM: 82,
    LW: 70,
    RW: 70,
  },

  LW: {
    LW: 100,
    ST: 82,
    RW: 72,
    LWB: 52,
  },

  RW: {
    RW: 100,
    ST: 82,
    LW: 72,
    RWB: 52,
  },

  ST: {
    ST: 100,
    LW: 72,
    RW: 72,
  },
};

type SelectedPlayer = {
  playerId: string;
  oldSlot: FormationSlot;
};

export function createEmptyLineup(formation: Formation): Lineup {
  return Object.fromEntries(
    FORMATION_SLOTS[formation].map((slot) => [slot.id, null]),
  ) as Lineup;
}

export function getCompatibilityScore(
  playerPositions: PlayerPosition[],
  targetRole: PlayerPosition,
): number {
  return Math.max(
    ...playerPositions.map(
      (position) => POSITION_COMPATIBILITY[position][targetRole] ?? 0,
    ),
  );
}

export function remapLineup(
  currentFormation: Formation,
  nextFormation: Formation,
  currentLineup: Lineup,
): Lineup {
  if (currentFormation === nextFormation) {
    return { ...currentLineup };
  }

  const currentSlots = FORMATION_SLOTS[currentFormation];
  const nextSlots = FORMATION_SLOTS[nextFormation];
  const nextLineup = createEmptyLineup(nextFormation);

  const selectedPlayers: SelectedPlayer[] = [];
  const seenPlayers = new Set<string>();

  for (const slot of currentSlots) {
    const playerId = currentLineup[slot.id];

    if (!playerId || seenPlayers.has(playerId)) {
      continue;
    }

    selectedPlayers.push({
      playerId,
      oldSlot: slot,
    });

    seenPlayers.add(playerId);
  }

  const availableSlotIds = new Set(nextSlots.map((slot) => slot.id));
  const remainingPlayers: SelectedPlayer[] = [];

  /*
   * 1차 배치:
   * 같은 슬롯이 새 포메이션에도 존재하고 포지션이 어느 정도 적합하면
   * 기존 자리를 유지합니다.
   */
  for (const selectedPlayer of selectedPlayers) {
    const player = PLAYER_BY_ID[selectedPlayer.playerId];
    const sameSlot = nextSlots.find(
      (slot) => slot.id === selectedPlayer.oldSlot.id,
    );

    if (!player || !sameSlot) {
      remainingPlayers.push(selectedPlayer);
      continue;
    }

    const score = getCompatibilityScore(
      player.positions,
      sameSlot.role,
    );

    if (score < 60) {
      remainingPlayers.push(selectedPlayer);
      continue;
    }

    nextLineup[sameSlot.id] = selectedPlayer.playerId;
    availableSlotIds.delete(sameSlot.id);
  }

  /*
   * 배치 가능한 포지션이 적은 선수부터 처리합니다.
   * 예: 골키퍼처럼 들어갈 수 있는 자리가 한 곳뿐인 선수
   */
  remainingPlayers.sort((first, second) => {
    const firstPlayer = PLAYER_BY_ID[first.playerId];
    const secondPlayer = PLAYER_BY_ID[second.playerId];

    const firstChoices = firstPlayer
      ? nextSlots.filter(
          (slot) =>
            availableSlotIds.has(slot.id) &&
            getCompatibilityScore(firstPlayer.positions, slot.role) >= 60,
        ).length
      : 999;

    const secondChoices = secondPlayer
      ? nextSlots.filter(
          (slot) =>
            availableSlotIds.has(slot.id) &&
            getCompatibilityScore(secondPlayer.positions, slot.role) >= 60,
        ).length
      : 999;

    return firstChoices - secondChoices;
  });

  /*
   * 2차 배치:
   * 남은 선수들을 포지션 적합도와 기존 위치와의 거리를 기준으로
   * 가장 적절한 슬롯에 배치합니다.
   */
  for (const selectedPlayer of remainingPlayers) {
    const player = PLAYER_BY_ID[selectedPlayer.playerId];

    if (!player) {
      continue;
    }

    const availableSlots = nextSlots.filter((slot) =>
      availableSlotIds.has(slot.id),
    );

    if (availableSlots.length === 0) {
      break;
    }

    const bestSlot = availableSlots
      .map((slot) => {
        const compatibility = getCompatibilityScore(
          player.positions,
          slot.role,
        );

        const distance = Math.hypot(
          slot.x - selectedPlayer.oldSlot.x,
          slot.y - selectedPlayer.oldSlot.y,
        );

        const previousRoleBonus =
          slot.role === selectedPlayer.oldSlot.role ? 15 : 0;

        return {
          slot,
          score:
            compatibility * 100 +
            previousRoleBonus * 100 -
            distance,
        };
      })
      .sort((first, second) => second.score - first.score)[0]?.slot;

    if (!bestSlot) {
      continue;
    }

    nextLineup[bestSlot.id] = selectedPlayer.playerId;
    availableSlotIds.delete(bestSlot.id);
  }

  return nextLineup;
}

export type PositionFitLevel =
  | "perfect"
  | "good"
  | "possible"
  | "poor";

export type PositionFitResult = {
  score: number;
  level: PositionFitLevel;
  label: string;
  penalty: number;
};

export type LineupEvaluation = {
  selectedCount: number;
  averageFit: number;
  tacticalPenalty: number;
  outOfPositionCount: number;
};

/**
 * 선수의 가능 포지션과 배치된 슬롯을 비교합니다.
 *
 * penalty는 나중에 경기 시뮬레이션에서
 * 팀 능력치 감소 비율로 사용할 예정입니다.
 */
export function getPositionFit(
  playerPositions: PlayerPosition[],
  targetRole: PlayerPosition,
): PositionFitResult {
  const score = getCompatibilityScore(
    playerPositions,
    targetRole,
  );

  if (score === 100) {
    return {
      score,
      level: "perfect",
      label: "최적",
      penalty: 0,
    };
  }

  if (score >= 85) {
    return {
      score,
      level: "good",
      label: "적합",
      penalty: 1,
    };
  }

  if (score >= 60) {
    return {
      score,
      level: "possible",
      label: "가능",
      penalty: 3,
    };
  }

  return {
    score,
    level: "poor",
    label: "부적합",
    penalty: 8,
  };
}

/**
 * 현재 선발 전체의 포지션 적합도를 계산합니다.
 */
export function evaluateLineup(
  formation: Formation,
  lineup: Lineup,
): LineupEvaluation {
  const slots = FORMATION_SLOTS[formation];

  let selectedCount = 0;
  let totalFitScore = 0;
  let tacticalPenalty = 0;
  let outOfPositionCount = 0;

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
    totalFitScore += fit.score;
    tacticalPenalty += fit.penalty;

    if (fit.level === "poor") {
      outOfPositionCount += 1;
    }
  }

  const averageFit =
    selectedCount > 0
      ? Math.round(totalFitScore / selectedCount)
      : 0;

  return {
    selectedCount,
    averageFit,
    tacticalPenalty: Math.min(tacticalPenalty, 30),
    outOfPositionCount,
  };
}