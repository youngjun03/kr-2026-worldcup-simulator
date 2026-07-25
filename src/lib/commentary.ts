import { PLAYER_BY_ID } from "@/data/players";

import type {
  AttackPattern,
  MatchEvent,
} from "@/types/match";

const PATTERN_TEXT: Record<
  AttackPattern,
  string
> = {
  counter_attack: "빠른 역습",
  central_attack: "중앙 침투",
  wing_attack: "측면 공격",
  possession_attack: "점유율 공격",
  set_piece: "세트피스",
};

export function createEventCommentary(
  event: MatchEvent,
  opponentName: string,
): string[] {
  const teamName =
    event.team === "korea"
      ? "대한민국"
      : opponentName;

  const creatorName =
    event.creatorPlayerId
      ? PLAYER_BY_ID[event.creatorPlayerId]
          ?.name
      : undefined;

  const shooterName =
    event.shooterPlayerId
      ? PLAYER_BY_ID[event.shooterPlayerId]
          ?.name
      : undefined;

  if (event.type === "build_up") {
    return [
      `${event.minute}분, ${teamName}이 중원에서 공격을 전개합니다.`,
      "하지만 상대 수비가 공간을 내주지 않습니다.",
    ];
  }

  const patternText = event.pattern
    ? PATTERN_TEXT[event.pattern]
    : "공격";

  if (
    event.type === "dangerous_attack"
  ) {
    return [
      `${event.minute}분, ${teamName}의 ${patternText}입니다.`,
      "위험한 지역까지 전진했지만 슈팅으로 연결되지는 못했습니다.",
    ];
  }

  if (
    event.outcome === "blocked"
  ) {
    return [
      `${event.minute}분, ${teamName}의 ${patternText}!`,
      createShotSentence(
        creatorName,
        shooterName,
      ),
      "슈팅이 수비수에게 막힙니다.",
    ];
  }

  if (
    event.outcome === "off_target"
  ) {
    return [
      `${event.minute}분, ${teamName}의 ${patternText}!`,
      createShotSentence(
        creatorName,
        shooterName,
      ),
      "슈팅이 골문을 벗어납니다.",
    ];
  }

  if (
    event.outcome === "saved"
  ) {
    return [
      `${event.minute}분, ${teamName}의 ${patternText}!`,
      createShotSentence(
        creatorName,
        shooterName,
      ),
      "골키퍼가 슈팅을 막아냅니다!",
    ];
  }

  return [
    `${event.minute}분, ${teamName}의 ${patternText}!`,
    createShotSentence(
      creatorName,
      shooterName,
    ),
    `${shooterName ?? teamName}의 슈팅, 골입니다!`,
  ];
}

function createShotSentence(
  creatorName?: string,
  shooterName?: string,
): string {
  if (
    creatorName &&
    shooterName
  ) {
    return `${creatorName}의 패스를 받은 ${shooterName}이 슈팅합니다.`;
  }

  if (shooterName) {
    return `${shooterName}이 직접 슈팅을 시도합니다.`;
  }

  return "공격수가 슈팅을 시도합니다.";
}