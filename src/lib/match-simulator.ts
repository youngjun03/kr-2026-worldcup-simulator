import { FORMATION_SLOTS } from "@/data/formations";
import { PLAYER_BY_ID } from "@/data/players";
import { getPositionFit } from "@/lib/lineup";
import { calculateMatchMetrics } from "@/lib/match-rating";
import {
  clamp,
  createSeededRandom,
  randomInteger,
  weightedChoice,
  type RandomSource,
} from "@/lib/random";
import {
  calculateTacticalModifiers,
  type TacticalModifiers,
} from "@/lib/tactical-matchup";

import type {
  Formation,
  Lineup,
  PlayerPosition,
  PlayerStats,
} from "@/types/game";
import type {
  AttackPattern,
  MatchEvent,
  MatchEventType,
  MatchMetrics,
  SegmentSimulationResult,
  ShotOutcome,
  SimulateSegmentInput,
  TeamSide,
} from "@/types/match";

type SelectedKoreaPlayer = {
  playerId: string;
  name: string;
  role: PlayerPosition;
  stats: PlayerStats;
};

/**
 * 한 번 호출할 때 5분 구간의 대표 이벤트 하나를 생성합니다.
 */
export function simulateMatchSegment(
  input: SimulateSegmentInput,
): SegmentSimulationResult {
  const koreaMetrics = calculateMatchMetrics(
    input.formation,
    input.lineup,
  );

  if (!koreaMetrics.isComplete) {
    throw new Error(
      "선발 선수 11명을 모두 배치해야 경기를 시작할 수 있습니다.",
    );
  }

  /*
   * 같은 경기 seed라도 구간마다 다른 난수가 나오도록
   * 시작 시간과 이벤트 번호를 함께 사용합니다.
   */
  const segmentSeed =
    input.seed +
    input.segmentStart * 1009 +
    input.state.eventIndex * 97;

  const random = createSeededRandom(segmentSeed);

  const koreaModifiers =
    calculateTacticalModifiers(
      input.tactics,
      input.opponent.tactics,
    );

  const opponentModifiers =
    calculateTacticalModifiers(
      input.opponent.tactics,
      input.tactics,
    );

  const attackingTeam = chooseAttackingTeam(
    koreaMetrics,
    input.opponent.metrics,
    koreaModifiers,
    opponentModifiers,
    random,
  );

  const minute = randomInteger(
    input.segmentStart,
    input.segmentEnd,
    random,
  );

  const attackingMetrics =
    attackingTeam === "korea"
      ? koreaMetrics
      : input.opponent.metrics;

  const defendingMetrics =
    attackingTeam === "korea"
      ? input.opponent.metrics
      : koreaMetrics;

  const modifiers =
    attackingTeam === "korea"
      ? koreaModifiers
      : opponentModifiers;

  const event = createAttackEvent({
    input,
    attackingTeam,
    attackingMetrics,
    defendingMetrics,
    modifiers,
    minute,
    random,
  });

  return {
    state: {
      currentMinute: input.segmentEnd,
      homeScore: event.homeScore,
      awayScore: event.awayScore,
      eventIndex:
        input.state.eventIndex + 1,
    },
    events: [event],
  };
}

type CreateAttackEventInput = {
  input: SimulateSegmentInput;
  attackingTeam: TeamSide;
  attackingMetrics: MatchMetrics;
  defendingMetrics: MatchMetrics;
  modifiers: TacticalModifiers;
  minute: number;
  random: RandomSource;
};

function createAttackEvent({
  input,
  attackingTeam,
  attackingMetrics,
  defendingMetrics,
  modifiers,
  minute,
  random,
}: CreateAttackEventInput): MatchEvent {
  const attackStrength =
    attackingMetrics.attack * 0.35 +
    attackingMetrics.chanceCreation * 0.35 +
    attackingMetrics.transition * 0.2 +
    attackingMetrics.midfield * 0.1;

  const defenseStrength =
    defendingMetrics.defense * 0.55 +
    defendingMetrics.pressing * 0.25 +
    defendingMetrics.goalkeeping * 0.2;

  const chanceProbability = clamp(
    (
      0.4 +
      (attackStrength - defenseStrength) *
        0.008
    ) * modifiers.chance,
    0.18,
    0.78,
  );

  const commonData = {
    id: `event-${input.seed}-${minute}-${input.state.eventIndex}`,
    minute,
    team: attackingTeam,
    homeScore: input.state.homeScore,
    awayScore: input.state.awayScore,
  };

  const baseReasons = createBaseReasons(
    attackStrength,
    defenseStrength,
    modifiers,
  );

  /*
   * 공격이 수비에 막히면 일반적인 빌드업 이벤트가 됩니다.
   */
  if (random() > chanceProbability) {
    return {
      ...commonData,
      type: "build_up",
      reasons: baseReasons,
    };
  }

  const pattern = chooseAttackPattern(
    attackingTeam === "korea"
      ? input.tactics.attackStyle
      : input.opponent.tactics.attackStyle,
    random,
  );

  const shotProbability = clamp(
    0.52 +
      (
        attackingMetrics.chanceCreation -
        defendingMetrics.defense
      ) *
        0.004,
    0.32,
    0.78,
  );

  /*
   * 기회는 만들었지만 슈팅까지 연결되지 않은 경우입니다.
   */
  if (random() > shotProbability) {
    return {
      ...commonData,
      type: "dangerous_attack",
      pattern,
      reasons: baseReasons,
    };
  }

  const selectedPlayers =
    attackingTeam === "korea"
      ? getSelectedKoreaPlayers(
          input.formation,
          input.lineup,
        )
      : [];

  const shooter =
    attackingTeam === "korea"
      ? selectShooter(
          selectedPlayers,
          pattern,
          random,
        )
      : undefined;

  const creator =
    attackingTeam === "korea"
      ? selectCreator(
          selectedPlayers.filter(
            (player) =>
              player.playerId !==
              shooter?.playerId,
          ),
          pattern,
          random,
        )
      : undefined;

  const shotQuality = calculateShotQuality(
    attackingMetrics,
    shooter,
  );

  const outcome = chooseShotOutcome(
    shotQuality,
    attackingMetrics,
    defendingMetrics,
    modifiers,
    random,
  );

  let homeScore = input.state.homeScore;
  let awayScore = input.state.awayScore;

  if (outcome === "goal") {
    if (attackingTeam === "korea") {
      homeScore += 1;
    } else {
      awayScore += 1;
    }
  }

  const eventType: MatchEventType =
    outcome === "goal"
      ? "goal"
      : outcome === "saved"
        ? "save"
        : "shot";

  const reasons = [...baseReasons];

  if (shooter) {
    reasons.push(
      `${shooter.name}의 보정 슈팅 능력 ${Math.round(
        shooter.stats.shooting,
      )}`,
    );
  }

  reasons.push(
    `슈팅 품질 ${Math.round(
      shotQuality,
    )} 대 상대 수비 ${defendingMetrics.defense}`,
  );

  return {
    ...commonData,
    type: eventType,
    pattern,
    creatorPlayerId: creator?.playerId,
    shooterPlayerId: shooter?.playerId,
    outcome,
    homeScore,
    awayScore,
    reasons: reasons.slice(0, 4),
  };
}

function chooseAttackingTeam(
  koreaMetrics: MatchMetrics,
  opponentMetrics: MatchMetrics,
  koreaModifiers: TacticalModifiers,
  opponentModifiers: TacticalModifiers,
  random: RandomSource,
): TeamSide {
  const koreaControl =
    (
      koreaMetrics.midfield * 0.5 +
      koreaMetrics.pressing * 0.2 +
      koreaMetrics.chanceCreation * 0.15 +
      koreaMetrics.overall * 0.15
    ) * koreaModifiers.possession;

  const opponentControl =
    (
      opponentMetrics.midfield * 0.5 +
      opponentMetrics.pressing * 0.2 +
      opponentMetrics.chanceCreation * 0.15 +
      opponentMetrics.overall * 0.15
    ) * opponentModifiers.possession;

  const koreaProbability = clamp(
    koreaControl /
      (koreaControl + opponentControl),
    0.25,
    0.75,
  );

  return random() < koreaProbability
    ? "korea"
    : "opponent";
}

function chooseAttackPattern(
  attackStyle:
    | "빠른 역습"
    | "점유율 중심"
    | "측면 공격"
    | "중앙 침투",
  random: RandomSource,
): AttackPattern {
  if (attackStyle === "빠른 역습") {
    return weightedChoice(
      [
        {
          value: "counter_attack",
          weight: 50,
        },
        {
          value: "central_attack",
          weight: 20,
        },
        {
          value: "wing_attack",
          weight: 20,
        },
        {
          value: "possession_attack",
          weight: 10,
        },
      ],
      random,
    );
  }

  if (attackStyle === "점유율 중심") {
    return weightedChoice(
      [
        {
          value: "possession_attack",
          weight: 45,
        },
        {
          value: "central_attack",
          weight: 25,
        },
        {
          value: "wing_attack",
          weight: 20,
        },
        {
          value: "counter_attack",
          weight: 10,
        },
      ],
      random,
    );
  }

  if (attackStyle === "측면 공격") {
    return weightedChoice(
      [
        {
          value: "wing_attack",
          weight: 55,
        },
        {
          value: "counter_attack",
          weight: 15,
        },
        {
          value: "central_attack",
          weight: 15,
        },
        {
          value: "possession_attack",
          weight: 15,
        },
      ],
      random,
    );
  }

  return weightedChoice(
    [
      {
        value: "central_attack",
        weight: 55,
      },
      {
        value: "possession_attack",
        weight: 20,
      },
      {
        value: "counter_attack",
        weight: 15,
      },
      {
        value: "wing_attack",
        weight: 10,
      },
    ],
    random,
  );
}

function calculateShotQuality(
  attackingMetrics: MatchMetrics,
  shooter?: SelectedKoreaPlayer,
): number {
  const teamShotQuality =
    attackingMetrics.attack * 0.45 +
    attackingMetrics.chanceCreation * 0.3 +
    attackingMetrics.transition * 0.15 +
    attackingMetrics.midfield * 0.1;

  if (!shooter) {
    return teamShotQuality;
  }

  const playerShotQuality =
    shooter.stats.shooting * 0.5 +
    shooter.stats.dribbling * 0.2 +
    shooter.stats.pace * 0.15 +
    shooter.stats.passing * 0.1 +
    shooter.stats.stamina * 0.05;

  return (
    playerShotQuality * 0.65 +
    teamShotQuality * 0.35
  );
}

function chooseShotOutcome(
  shotQuality: number,
  attackingMetrics: MatchMetrics,
  defendingMetrics: MatchMetrics,
  modifiers: TacticalModifiers,
  random: RandomSource,
): ShotOutcome {
  const defensiveResistance =
    defendingMetrics.defense * 0.55 +
    defendingMetrics.goalkeeping * 0.45;

  const goalWeight =
    clamp(
      0.12 +
        (
          shotQuality -
          defensiveResistance
        ) *
          0.005,
      0.04,
      0.32,
    ) * modifiers.shotQuality;

  const saveWeight = clamp(
    0.28 +
      (
        defendingMetrics.goalkeeping -
        shotQuality
      ) *
        0.003,
    0.16,
    0.44,
  );

  const blockedWeight = clamp(
    0.25 +
      (
        defendingMetrics.defense -
        attackingMetrics.attack
      ) *
        0.003,
    0.14,
    0.4,
  );

  const offTargetWeight = clamp(
    0.3 +
      (75 - shotQuality) * 0.004,
    0.16,
    0.42,
  );

  return weightedChoice(
    [
      {
        value: "goal",
        weight: goalWeight,
      },
      {
        value: "saved",
        weight: saveWeight,
      },
      {
        value: "blocked",
        weight: blockedWeight,
      },
      {
        value: "off_target",
        weight: offTargetWeight,
      },
    ],
    random,
  );
}

function getSelectedKoreaPlayers(
  formation: Formation,
  lineup: Lineup,
): SelectedKoreaPlayer[] {
  const slots = FORMATION_SLOTS[formation];

  const result: SelectedKoreaPlayer[] = [];

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

    result.push({
      playerId,
      name: player.name,
      role: slot.role,
      stats: {
        pace:
          player.stats.pace * fit.multiplier,
        shooting:
          player.stats.shooting *
          fit.multiplier,
        passing:
          player.stats.passing *
          fit.multiplier,
        dribbling:
          player.stats.dribbling *
          fit.multiplier,
        defending:
          player.stats.defending *
          fit.multiplier,
        stamina:
          player.stats.stamina *
          fit.multiplier,
      },
    });
  }

  return result;
}

function selectShooter(
  players: SelectedKoreaPlayer[],
  pattern: AttackPattern,
  random: RandomSource,
): SelectedKoreaPlayer | undefined {
  const candidates = players.filter(
    (player) => player.role !== "GK",
  );

  if (candidates.length === 0) {
    return undefined;
  }

  return weightedChoice(
    candidates.map((player) => ({
      value: player,
      weight:
        player.stats.shooting * 0.5 +
        player.stats.pace * 0.2 +
        player.stats.dribbling * 0.2 +
        getShooterRoleBonus(
          player.role,
          pattern,
        ),
    })),
    random,
  );
}

function selectCreator(
  players: SelectedKoreaPlayer[],
  pattern: AttackPattern,
  random: RandomSource,
): SelectedKoreaPlayer | undefined {
  const candidates = players.filter(
    (player) => player.role !== "GK",
  );

  if (candidates.length === 0) {
    return undefined;
  }

  return weightedChoice(
    candidates.map((player) => ({
      value: player,
      weight:
        player.stats.passing * 0.5 +
        player.stats.dribbling * 0.25 +
        player.stats.pace * 0.1 +
        getCreatorRoleBonus(
          player.role,
          pattern,
        ),
    })),
    random,
  );
}

function getShooterRoleBonus(
  role: PlayerPosition,
  pattern: AttackPattern,
): number {
  let bonus = 0;

  if (role === "ST") {
    bonus += 30;
  }

  if (role === "LW" || role === "RW") {
    bonus += 22;
  }

  if (role === "AM") {
    bonus += 12;
  }

  if (
    pattern === "counter_attack" &&
    ["ST", "LW", "RW"].includes(role)
  ) {
    bonus += 15;
  }

  if (
    pattern === "wing_attack" &&
    role === "ST"
  ) {
    bonus += 12;
  }

  return bonus;
}

function getCreatorRoleBonus(
  role: PlayerPosition,
  pattern: AttackPattern,
): number {
  let bonus = 0;

  if (
    role === "AM" ||
    role === "CM"
  ) {
    bonus += 24;
  }

  if (
    role === "LW" ||
    role === "RW"
  ) {
    bonus += 18;
  }

  if (
    pattern === "wing_attack" &&
    ["LW", "RW", "LWB", "RWB"].includes(
      role,
    )
  ) {
    bonus += 16;
  }

  if (
    pattern === "central_attack" &&
    ["AM", "CM", "DM"].includes(role)
  ) {
    bonus += 16;
  }

  return bonus;
}

function createBaseReasons(
  attackStrength: number,
  defenseStrength: number,
  modifiers: TacticalModifiers,
): string[] {
  const reasons: string[] = [];

  if (
    attackStrength >=
    defenseStrength + 4
  ) {
    reasons.push(
      "공격 지표가 상대 수비 지표보다 우세",
    );
  } else if (
    defenseStrength >=
    attackStrength + 4
  ) {
    reasons.push(
      "상대 수비 지표가 공격 지표보다 우세",
    );
  } else {
    reasons.push(
      "공격과 수비 지표가 비슷한 상황",
    );
  }

  reasons.push(...modifiers.reasons);

  return reasons.slice(0, 3);
}