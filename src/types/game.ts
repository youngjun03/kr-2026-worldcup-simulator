export type Formation = "4-2-3-1" | "4-3-3" | "3-4-3";

export type AttackStyle =
  | "빠른 역습"
  | "점유율 중심"
  | "측면 공격"
  | "중앙 침투";

export type DefenseStyle =
  | "전방 압박"
  | "중간 블록"
  | "수비 집중";

export type DefensiveLine = "낮음" | "보통" | "높음";

export type Tactics = {
  formation: Formation;
  attackStyle: AttackStyle;
  defenseStyle: DefenseStyle;
  defensiveLine: DefensiveLine;
};