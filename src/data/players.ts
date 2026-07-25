import type {
  Player,
  PlayerStats,
} from "@/types/game";

type PlayerSeed = Omit<Player, "stats"> & {
  stats?: PlayerStats;
};

/*
 * FC 능력치를 입력하지 않은 선수에게 적용되는 임시 값입니다.
 * 실제 데이터를 입력하면 해당 선수의 stats가 우선 적용됩니다.
 */
const TEMPORARY_STATS: PlayerStats = {
  pace: 70,
  shooting: 70,
  passing: 70,
  dribbling: 70,
  defending: 70,
  stamina: 70,
};

const PLAYER_SEEDS: PlayerSeed[] = [
  {
    id: "jo-hyeon-woo",
    name: "조현우",
    positions: ["GK"],
    // stats: {
    //   pace: 0,
    //   shooting: 0,
    //   passing: 0,
    //   dribbling: 0,
    //   defending: 0,
    //   stamina: 0,
    // },
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

export const KOREA_PLAYERS: Player[] = PLAYER_SEEDS.map(
  (player) => ({
    ...player,
    stats: player.stats ?? TEMPORARY_STATS,
  }),
);

export const PLAYER_BY_ID = Object.fromEntries(
  KOREA_PLAYERS.map((player) => [player.id, player]),
) as Record<string, Player>;