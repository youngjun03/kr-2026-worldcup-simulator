import type { OpponentProfile } from "@/types/match";

/*
 * 현재 값은 경기 엔진 개발을 위한 프로토타입 밸런스입니다.
 * 공식 FIFA 또는 FC 능력치가 아닙니다.
 */
export const MEXICO: OpponentProfile = {
  id: "mexico",
  name: "멕시코",
  flag: "🇲🇽",

  metrics: {
    attack: 81,
    midfield: 82,
    defense: 78,
    pressing: 86,
    transition: 82,
    chanceCreation: 81,
    goalkeeping: 79,
    overall: 81,
  },

  tactics: {
    attackStyle: "측면 공격",
    defenseStyle: "전방 압박",
    defensiveLine: "높음",
  },

  strengths: [
    "적극적인 전방 압박",
    "빠른 측면 전개",
    "높은 중원 활동량",
  ],

  weaknesses: [
    "압박 실패 후 발생하는 뒷공간",
    "높은 수비 라인 뒤쪽 공간",
    "빠른 공격 전환에 대한 대응",
  ],
};

export const OPPONENTS: Record<
  string,
  OpponentProfile
> = {
  mexico: MEXICO,
};