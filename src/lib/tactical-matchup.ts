import { clamp } from "@/lib/random";

import type { TeamTactics } from "@/types/match";

export type TacticalModifiers = {
  possession: number;
  chance: number;
  shotQuality: number;
  reasons: string[];
};

/**
 * 공격 팀의 전술과 수비 팀의 전술을 비교합니다.
 *
 * 선수 능력치를 직접 변경하지 않고,
 * 경기 이벤트가 발생할 확률만 조정합니다.
 */
export function calculateTacticalModifiers(
  attackingTactics: TeamTactics,
  defendingTactics: TeamTactics,
): TacticalModifiers {
  let possession = 1;
  let chance = 1;
  let shotQuality = 1;

  const reasons: string[] = [];

  if (
    attackingTactics.attackStyle ===
    "빠른 역습"
  ) {
    possession *= 0.94;

    if (
      defendingTactics.defenseStyle ===
      "전방 압박"
    ) {
      chance *= 1.1;
      shotQuality *= 1.05;

      reasons.push(
        "상대의 전방 압박 뒤 공간을 빠른 역습으로 공략",
      );
    }

    if (
      defendingTactics.defensiveLine ===
      "높음"
    ) {
      chance *= 1.12;
      shotQuality *= 1.08;

      reasons.push(
        "높은 수비 라인 뒤쪽 공간을 공략",
      );
    }

    if (
      defendingTactics.defensiveLine ===
      "낮음"
    ) {
      chance *= 0.9;

      reasons.push(
        "낮은 수비 라인으로 역습 공간이 제한됨",
      );
    }
  }

  if (
    attackingTactics.attackStyle ===
    "점유율 중심"
  ) {
    possession *= 1.08;

    if (
      defendingTactics.defenseStyle ===
      "전방 압박"
    ) {
      possession *= 0.96;
      chance *= 0.95;

      reasons.push(
        "상대 전방 압박으로 후방 빌드업에 부담 발생",
      );
    }

    if (
      defendingTactics.defenseStyle ===
      "수비 집중"
    ) {
      possession *= 1.05;
      chance *= 0.92;

      reasons.push(
        "점유율은 높지만 밀집 수비 공략에 어려움",
      );
    }
  }

  if (
    attackingTactics.attackStyle ===
    "측면 공격"
  ) {
    if (
      defendingTactics.defenseStyle ===
      "수비 집중"
    ) {
      chance *= 1.1;
      shotQuality *= 1.04;

      reasons.push(
        "밀집된 중앙 대신 측면 공간을 공략",
      );
    }
  }

  if (
    attackingTactics.attackStyle ===
    "중앙 침투"
  ) {
    if (
      defendingTactics.defenseStyle ===
      "수비 집중"
    ) {
      chance *= 0.86;
      shotQuality *= 0.93;

      reasons.push(
        "상대 밀집 수비로 중앙 공간이 제한됨",
      );
    }

    if (
      defendingTactics.defenseStyle ===
      "전방 압박"
    ) {
      chance *= 1.05;

      reasons.push(
        "상대 압박 라인 사이의 중앙 공간을 공략",
      );
    }
  }

  if (
    defendingTactics.defensiveLine === "높음"
  ) {
    shotQuality *= 1.03;
  }

  if (
    defendingTactics.defensiveLine === "낮음"
  ) {
    chance *= 0.94;
    shotQuality *= 0.96;
  }

  return {
    possession: clamp(possession, 0.75, 1.3),
    chance: clamp(chance, 0.75, 1.3),
    shotQuality: clamp(
      shotQuality,
      0.75,
      1.3,
    ),
    reasons,
  };
}