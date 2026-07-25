import type { Player } from "@/types/game";

/*
 * UI와 드래그 앤 드롭 구현을 위한 프로토타입 명단입니다.
 * 공식 2026 월드컵 최종 엔트리가 아닙니다.
 */
export const KOREA_PLAYERS: Player[] = [
  {
    id: "jo-hyeon-woo",
    name: "조현우",
    positions: ["GK"],
  },
  {
    id: "kim-seung-gyu",
    name: "김승규",
    positions: ["GK"],
  },

  {
    id: "kim-min-jae",
    name: "김민재",
    positions: ["CB"],
  },
  {
    id: "jo-yu-min",
    name: "조유민",
    positions: ["CB"],
  },
  {
    id: "kwon-kyung-won",
    name: "권경원",
    positions: ["CB", "LB"],
  },
  {
    id: "seol-young-woo",
    name: "설영우",
    positions: ["RB", "LB", "RWB"],
  },
  {
    id: "lee-tae-seok",
    name: "이태석",
    positions: ["LB", "LWB"],
  },
  {
    id: "kim-moon-hwan",
    name: "김문환",
    positions: ["RB", "RWB"],
  },

  {
    id: "hwang-in-beom",
    name: "황인범",
    positions: ["CM", "DM"],
  },
  {
    id: "park-yong-woo",
    name: "박용우",
    positions: ["DM", "CM", "CB"],
  },
  {
    id: "lee-jae-sung",
    name: "이재성",
    positions: ["AM", "CM", "RW"],
  },
  {
    id: "lee-kang-in",
    name: "이강인",
    positions: ["RW", "AM", "CM"],
  },
  {
    id: "bae-jun-ho",
    name: "배준호",
    positions: ["AM", "LW", "CM"],
  },

  {
    id: "son-heung-min",
    name: "손흥민",
    positions: ["LW", "ST"],
  },
  {
    id: "hwang-hee-chan",
    name: "황희찬",
    positions: ["LW", "RW", "ST"],
  },
  {
    id: "cho-gue-sung",
    name: "조규성",
    positions: ["ST"],
  },
  {
    id: "oh-hyeon-gyu",
    name: "오현규",
    positions: ["ST"],
  },
  {
    id: "yang-min-hyeok",
    name: "양민혁",
    positions: ["RW", "LW"],
  },
];

export const PLAYER_BY_ID = Object.fromEntries(
  KOREA_PLAYERS.map((player) => [player.id, player]),
) as Record<string, Player>;