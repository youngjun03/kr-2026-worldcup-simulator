import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
  Formation,
} from "@/types/game";

export const FORMATIONS: Formation[] = [
  "4-2-3-1",
  "4-3-3",
  "3-4-3",
];

export const ATTACK_STYLES: AttackStyle[] = [
  "빠른 역습",
  "점유율 중심",
  "측면 공격",
  "중앙 침투",
];

export const DEFENSE_STYLES: DefenseStyle[] = [
  "전방 압박",
  "중간 블록",
  "수비 집중",
];

export const DEFENSIVE_LINES: DefensiveLine[] = [
  "낮음",
  "보통",
  "높음",
];