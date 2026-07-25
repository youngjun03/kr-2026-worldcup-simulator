import type { Player } from "@/types/game";

export const KOREA_PLAYERS: Player[] = [
  {
    id: "jo-hyeon-woo",
    name: "조현우",
    number: 21,
    positions: ["GK"],
  },
  {
    id: "kim-min-jae",
    name: "김민재",
    number: 4,
    positions: ["CB"],
  },
  {
    id: "lee-han-beom",
    name: "이한범",
    number: 15,
    positions: ["CB"],
  },
  {
    id: "seol-young-woo",
    name: "설영우",
    number: 22,
    positions: ["RB", "LB", "RWB"],
  },
  {
    id: "lee-tae-seok",
    name: "이태석",
    number: 2,
    positions: ["LB", "LWB"],
  },
  {
    id: "park-yong-woo",
    name: "박용우",
    number: 5,
    positions: ["DM", "CM", "CB"],
  },
  {
    id: "hwang-in-beom",
    name: "황인범",
    number: 6,
    positions: ["CM", "DM"],
  },
  {
    id: "lee-kang-in",
    name: "이강인",
    number: 18,
    positions: ["AM", "CM", "RW"],
  },
  {
    id: "son-heung-min",
    name: "손흥민",
    number: 7,
    positions: ["LW", "ST"],
  },
  {
    id: "hwang-hee-chan",
    name: "황희찬",
    number: 11,
    positions: ["LW", "RW", "ST"],
  },
  {
    id: "cho-gue-sung",
    name: "조규성",
    number: 9,
    positions: ["ST"],
  },
];

export const PLAYER_BY_ID = Object.fromEntries(
  KOREA_PLAYERS.map((player) => [player.id, player]),
) as Record<string, Player>;